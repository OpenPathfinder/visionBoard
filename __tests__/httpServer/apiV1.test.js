const request = require('supertest')
const { generateStaticReports } = require('../../src/reports')
const knexInit = require('knex')
const { getConfig } = require('../../src/config')
const { resetDatabase, initializeStore } = require('../../__utils__')
const pkg = require('../../package.json')
const serverModule = require('../../src/httpServer')
const { dbSettings } = getConfig('test')
let server
let serverStop
let app
let knex
let getAllProjects

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
  knex = knexInit(dbSettings);
  ({
    getAllProjects
  } = initializeStore(knex))
})

afterAll(async () => {
  // Cleanup after all tests
  await serverStop?.()
  await resetDatabase(knex)
  await knex.destroy()
})

beforeEach(async () => {
  await resetDatabase(knex)
  jest.clearAllMocks()
})

afterEach(jest.clearAllMocks)

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

  describe('POST /api/v1/project', () => {
    test('should return 200 and create a new project', async () => {
      // Initial state
      let projects = await getAllProjects()
      expect(projects.length).toBe(0)
      // Request
      const newProject = { name: 'eslint' }
      const response = await app.post('/api/v1/project').send(newProject)
      // Database changes
      projects = await getAllProjects()
      expect(projects.length).toBe(1)
      expect(projects[0].name).toBe('eslint')
      // Response details
      expect(response.status).toBe(201)
      expect(response.headers).toHaveProperty('location', `/api/v1/project/${projects[0].id}`)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name', newProject.name)
      expect(response.body).toHaveProperty('created_at')
      expect(response.body).toHaveProperty('updated_at')
    })
    test('should return 400 for invalid project name', async () => {
      // Initial state
      let projects = await getAllProjects()
      expect(projects.length).toBe(0)
      // Request
      const invalidProject = { name: 'Invalid Name!' }
      const response = await app.post('/api/v1/project').send(invalidProject)
      // Database changes
      projects = await getAllProjects()
      expect(projects.length).toBe(0)
      // Response details
      expect(response.status).toBe(400)
      expect(response.body).toStrictEqual({ errors: [{ errorCode: 'pattern.openapi.validation', message: 'must match pattern "^[a-zA-Z0-9_-]+$"', path: '/body/name' }], name: 'Bad Request', path: '/api/v1/project', status: 400 })
    })
    test('should return 409 if the project already exists', async () => {
      // Initial state
      let projects = await getAllProjects()
      expect(projects.length).toBe(0)
      // Create the project first
      const existingProject = { name: 'eslint' }
      await app.post('/api/v1/project').send(existingProject)
      projects = await getAllProjects()
      expect(projects.length).toBe(1)
      // Request to create the same project again
      const response = await app.post('/api/v1/project').send(existingProject)
      // Database changes
      projects = await getAllProjects()
      expect(projects.length).toBe(1) // Still only one project
      // Response details
      expect(response.status).toBe(409)
      expect(response.body).toStrictEqual({ errors: [{ message: 'Project already exists.' }] })
    })

    test.todo('should return 500 for internal server error')
  })

  describe('GET /api/v1/workflow', () => {
    test('should return 200 and a list of workflows', async () => {
      const response = await app.get('/api/v1/workflow')

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBeGreaterThan(0)

      const workflow = response.body[0]
      expect(workflow).toHaveProperty('name')
      expect(workflow).toHaveProperty('description')
    })

    test.todo('should return 500 for internal server error')
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
