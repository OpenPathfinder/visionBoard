const request = require('supertest')
const { generateStaticReports } = require('../../src/reports')
const pkg = require('../../package.json')
const serverModule = require('../../src/httpServer')
let server
let serverStop
let app

// Mocks
jest.mock('../../src/reports', () => ({
  generateStaticReports: jest.fn()
}))

beforeAll(async () => {
  // Initialize server asynchronously
  const serverInstance = serverModule()
  server = await serverInstance.start()
  serverStop = serverInstance.stop
  app = request(server)
})

afterAll(async () => {
  // Cleanup after all tests
  await serverStop?.()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('HTTP Server API V1', () => {
  describe('GET /api/v1/__health', () => {
    test('should return status ok', async () => {
      const response = await app.get('/api/v1/__health')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('status', 'ok')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('version', pkg.version)
      expect(response.body).toHaveProperty('name', pkg.name)

      const timestamp = new Date(response.body.timestamp)
      expect(timestamp.toISOString()).toBe(response.body.timestamp)
    })
  })

  describe('POST /api/v1/generate-reports', () => {
    test('should return status completed when report generation succeeds', async () => {
      generateStaticReports.mockResolvedValueOnce()

      const response = await app.post('/api/v1/generate-reports')

      expect(generateStaticReports).toHaveBeenCalledWith(expect.anything(), { clearPreviousReports: true })
      expect(response.status).toBe(202)
      expect(response.body).toHaveProperty('status', 'completed')
      expect(response.body).toHaveProperty('startedAt')
      expect(response.body).toHaveProperty('finishedAt')

      const startedAt = new Date(response.body.startedAt)
      const finishedAt = new Date(response.body.finishedAt)
      expect(startedAt.toISOString()).toBe(response.body.startedAt)
      expect(finishedAt.toISOString()).toBe(response.body.finishedAt)
      expect(finishedAt.getTime()).toBeGreaterThanOrEqual(startedAt.getTime())
    })

    test('should return status failed when report generation fails', async () => {
      generateStaticReports.mockRejectedValueOnce(new Error('Report generation failed'))

      const response = await app.post('/api/v1/generate-reports')

      expect(generateStaticReports).toHaveBeenCalledWith(expect.anything(), { clearPreviousReports: true })
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('status', 'failed')
      expect(response.body).toHaveProperty('startedAt')
      expect(response.body).toHaveProperty('finishedAt')

      const startedAt = new Date(response.body.startedAt)
      const finishedAt = new Date(response.body.finishedAt)
      expect(startedAt.toISOString()).toBe(response.body.startedAt)
      expect(finishedAt.toISOString()).toBe(response.body.finishedAt)
      expect(finishedAt.getTime()).toBeGreaterThanOrEqual(startedAt.getTime())
    })
  })
})
