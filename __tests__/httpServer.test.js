const request = require('supertest')
const serverModule = require('../src/httpServer')
const server = serverModule()
const app = request(server)

// Cleanup after all tests
afterAll(() => {
  if (server && server.close) {
    server.close()
  }
})

describe('HTTP Server API', () => {
  test('health check endpoint should return status ok', async () => {
    const response = await app.get('/api/v1/__health')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'ok')
    expect(response.body).toHaveProperty('timestamp')

    const timestamp = new Date(response.body.timestamp)
    expect(timestamp.toISOString()).toBe(response.body.timestamp)
  })

  test('non-existent API endpoint should return 404', async () => {
    const response = await app.get('/api/v1/non-existent-endpoint')

    expect(response.status).toBe(404)
  })
})
