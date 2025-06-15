// Mocks
jest.mock('../../src/reports', () => ({
  generateStaticReports: jest.fn()
}))

const mockWorkflowFn = jest.fn()
jest.mock('../../src/cli/workflows', () => ({
  getWorkflowsDetails: jest.fn(() => ({
    workflows: {
      'test-workflow': {
        name: 'test-workflow',
        description: 'Test workflow',
        workflow: mockWorkflowFn
      }
    },
    workflowsList: [
      { id: 'test-workflow', description: 'Test workflow' }
    ]
  }))
}))

const request = require('supertest')
const knexInit = require('knex')
const { getConfig } = require('../../src/config')
const { resetDatabase, initializeStore } = require('../../__utils__')
const pkg = require('../../package.json')
const serverModule = require('../../src/httpServer')
const { dbSettings } = getConfig('test')
const { getWorkflowsDetails } = require('../../src/cli/workflows')
const { workflowsList } = getWorkflowsDetails()

let server
let serverStop
let app
let knex
let getAllProjects

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
      expect(response.body).toStrictEqual(workflowsList)
    })

    test.todo('should return 500 for internal server error')
  })

  describe('POST /api/v1/workflow/:id/run', () => {
    let workflowSpy
    let mockWorkflowFn

    beforeEach(() => {
      mockWorkflowFn = jest.fn()
      workflowSpy = jest.spyOn(require('../../src/cli/workflows'), 'getWorkflowsDetails').mockReturnValue({
        workflows: {
          'test-workflow': {
            name: 'test-workflow',
            description: 'Test workflow',
            workflow: mockWorkflowFn
          }
        },
        workflowsList: [
          { id: 'test-workflow', description: 'Test workflow' }
        ]
      })
    })

    afterEach(() => {
      workflowSpy.mockRestore()
      jest.clearAllMocks()
    })

    test('should return 202 and run the specified workflow', async () => {
      mockWorkflowFn.mockResolvedValueOnce()
      const response = await app
        .post('/api/v1/workflow/test-workflow/run')
        .set('Content-Type', 'application/json')
        .send({ some: 'data' })

      expect(response.status).toBe(202)
      expect(response.body).toHaveProperty('status', 'completed')
      expect(response.body.workflow).toMatchObject({
        id: 'test-workflow',
        description: 'Test workflow'
      })
      // The first argument (...calls[0][0]) is Knex and we ignore it due framework limitations
      expect(mockWorkflowFn.mock.calls[0][1]).toEqual({ some: 'data' })
    })

    test('should return 404 for invalid workflow ID', async () => {
    // Overwrite the spy to return no workflows
      workflowSpy.mockReturnValueOnce({
        workflows: {},
        workflowsList: []
      })
      const response = await app
        .post('/api/v1/workflow/invalid-workflow/run')
        .set('Content-Type', 'application/json')
        .send({})

      expect(response.status).toBe(404)
      expect(response.body).toStrictEqual({ errors: [{ message: 'Workflow not found' }] })
    })

    test('should return 500 for internal server error', async () => {
      mockWorkflowFn.mockRejectedValueOnce(new Error('Something went wrong'))

      const response = await app
        .post('/api/v1/workflow/test-workflow/run')
        .set('Content-Type', 'application/json')
        .send({ some: 'data' })

      expect(response.status).toBe(500)
      expect(response.body.status).toBe('failed')
      expect(response.body.workflow).toMatchObject({
        id: 'test-workflow',
        description: 'Test workflow'
      })
      expect(response.body.errors[0].message).toMatch(/Failed to run workflow: Something went wrong/)
      // The first argument (...calls[0][0]) is Knex and we ignore it due framework limitations
      expect(mockWorkflowFn.mock.calls[0][1]).toEqual({ some: 'data' })
    })

    test.todo('should return 500 when workflow execution times out')
  })
})
