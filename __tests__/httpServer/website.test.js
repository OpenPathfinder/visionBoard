const request = require('supertest')
const knexInit = require('knex')
const serverModule = require('../../src/httpServer')
const { getConfig } = require('../../src/config')
const { resetDatabase, initializeStore } = require('../../__utils__')

const { dbSettings } = getConfig('test')

let server
let serverStop
let app
let knex
let addProject
let testProjectId

beforeAll(async () => {
  // Initialize database
  knex = knexInit(dbSettings);
  ({ addProject } = initializeStore(knex))

  // Reset database and add test project
  await resetDatabase(knex)
  const testProject = await addProject({ name: 'Test Project' })
  testProjectId = testProject.id

  // Initialize server asynchronously
  const serverInstance = serverModule()
  server = await serverInstance.start()
  serverStop = serverInstance.stop
  app = request(server)
})

afterAll(async () => {
  // Cleanup after all tests
  await serverStop?.()
  await resetDatabase(knex)
  await knex.destroy()
})

describe('HTTP Server WEBSITE', () => {
  describe('GET /', () => {
    it('should render index page', async () => {
      const response = await app.get('/')
      expect(response.status).toBe(200)
      expect(response.header['content-type']).toMatch(/text\/html/)
    })
  })

  describe('GET /projects/:id', () => {
    it('should render project page for valid project ID', async () => {
      const response = await app.get(`/projects/${testProjectId}`)
      expect(response.status).toBe(200)
      expect(response.header['content-type']).toMatch(/text\/html/)
    })

    it('should render notFound page for invalid project ID format', async () => {
      const response = await app.get('/projects/invalid')
      expect(response.status).toBe(404)
      expect(response.header['content-type']).toMatch(/text\/html/)
    })

    it('should render notFound page for non-existent project ID', async () => {
      const nonExistentId = 9999
      const response = await app.get(`/projects/${nonExistentId}`)
      expect(response.status).toBe(404)
      expect(response.header['content-type']).toMatch(/text\/html/)
    })
  })
})
