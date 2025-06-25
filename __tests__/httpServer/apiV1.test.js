// Mocks
jest.mock('../../src/reports', () => ({
  generateStaticReports: jest.fn()
}))

const mockWorkflowFn = jest.fn()
jest.mock('../../src/workflows', () => ({
  getWorkflowsDetails: jest.fn(() => ({
    workflows: {
      'test-workflow': {
        name: 'test-workflow',
        description: 'Test workflow',
        isEnabled: true,
        isRequiredAdditionalData: false,
        workflow: mockWorkflowFn
      }
    },
    workflowsList: [
      { id: 'test-workflow', description: 'Test workflow', isEnabled: true, isRequiredAdditionalData: false }
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
const { getWorkflowsDetails } = require('../../src/workflows')
const { getAllBulkImportOperations } = require('../../src/importers')
const { workflowsList } = getWorkflowsDetails()

let server
let serverStop
let app
let knex
let getAllProjects
let addProject
let getAllGithubOrganizationsByProjectsId
let getAllChecks
let getCheckById
let getAllChecklists
let getChecklistById
let getProjectById

beforeAll(async () => {
  // Initialize server asynchronously
  const serverInstance = serverModule()
  server = await serverInstance.start()
  serverStop = serverInstance.stop
  app = request(server)
  knex = knexInit(dbSettings);
  ({
    getAllProjects,
    addProject,
    getAllGithubOrganizationsByProjectsId,
    getAllChecks,
    getCheckById,
    getAllChecklists,
    getChecklistById,
    getProjectById
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

  describe('POST /api/v1/workflow/:id/execute', () => {
    let workflowSpy
    let mockWorkflowFn

    beforeEach(() => {
      mockWorkflowFn = jest.fn()
      workflowSpy = jest.spyOn(require('../../src/workflows'), 'getWorkflowsDetails').mockReturnValue({
        workflows: {
          'test-workflow': {
            name: 'test-workflow',
            description: 'Test workflow',
            isEnabled: true,
            isRequiredAdditionalData: false,
            workflow: mockWorkflowFn
          }
        },
        workflowsList: [{
          id: 'test-workflow',
          description: 'Test workflow',
          isEnabled: true,
          isRequiredAdditionalData: false
        }]
      })
    })

    afterEach(() => {
      workflowSpy.mockRestore()
      jest.clearAllMocks()
    })

    test('should return 202 and run the specified workflow', async () => {
      mockWorkflowFn.mockResolvedValueOnce()
      const response = await app
        .post('/api/v1/workflow/test-workflow/execute')
        .set('Content-Type', 'application/json')
        .send({ data: { some: 'data' } })

      expect(response.status).toBe(202)
      expect(response.body).toHaveProperty('status', 'completed')
      // The first argument (...calls[0][0]) is Knex and we ignore it due test framework limitations
      expect(mockWorkflowFn.mock.calls[0][1]).toEqual({ some: 'data' })
    })

    test('should return 404 for invalid workflow ID', async () => {
    // Overwrite the spy to return no workflows
      workflowSpy.mockReturnValueOnce({
        workflows: {},
        workflowsList: []
      })
      const response = await app
        .post('/api/v1/workflow/invalid-workflow/execute')
        .set('Content-Type', 'application/json')
        .send({})

      expect(response.status).toBe(404)
      expect(response.body).toStrictEqual({ errors: [{ message: 'Workflow not found' }] })
    })

    test('should return 403 for disabled workflow', async () => {
      // Overwrite the spy to return a disabled workflow
      workflowSpy.mockReturnValueOnce({
        workflows: {
          'test-workflow': {
            name: 'test-workflow',
            description: 'Test workflow',
            isEnabled: false,
            isRequiredAdditionalData: false,
            workflow: mockWorkflowFn
          }
        },
        workflowsList: [{ id: 'test-workflow', description: 'Test workflow', isEnabled: false, isRequiredAdditionalData: false }]
      })
      const response = await app
        .post('/api/v1/workflow/test-workflow/execute')
        .set('Content-Type', 'application/json')
        .send({})

      expect(response.status).toBe(403)
      expect(response.body).toStrictEqual({ errors: [{ message: 'Workflow is disabled' }] })
    })

    test('should return 400 for missing required additional data', async () => {
      // Overwrite the spy to return a workflow that requires additional data
      workflowSpy.mockReturnValueOnce({
        workflows: {
          'test-workflow': {
            name: 'test-workflow',
            description: 'Test workflow',
            isEnabled: true,
            isRequiredAdditionalData: true,
            workflow: mockWorkflowFn
          }
        },
        workflowsList: [{ id: 'test-workflow', description: 'Test workflow', isEnabled: true, isRequiredAdditionalData: true }]
      })
      const response = await app
        .post('/api/v1/workflow/test-workflow/execute')
        .set('Content-Type', 'application/json')
        .send({})

      expect(response.status).toBe(400)
      expect(response.body).toStrictEqual({ errors: [{ message: 'Additional data is required' }] })
    })

    test('should return 500 for internal server error', async () => {
      mockWorkflowFn.mockRejectedValueOnce(new Error('Something went wrong'))

      const response = await app
        .post('/api/v1/workflow/test-workflow/execute')
        .set('Content-Type', 'application/json')
        .send({ data: { some: 'data' } })

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

  describe('POST /api/v1/project/:projectId/gh-org', () => {
    let projectId

    beforeEach(async () => {
      // Create a test project for each test
      const project = await addProject({ name: 'test-project' })
      projectId = project.id
    })

    test('should return 201 and add a new GitHub organization', async () => {
      const githubOrgUrl = 'https://github.com/expressjs'

      const response = await app
        .post(`/api/v1/project/${projectId}/gh-org`)
        .send({ githubOrgUrl })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('login', 'expressjs')
      expect(response.body).toHaveProperty('html_url', githubOrgUrl.toLowerCase())
      expect(response.body).toHaveProperty('project_id', projectId)

      // Verify the Location header is set correctly
      expect(response.headers).toHaveProperty('location', `/api/v1/project/${projectId}/gh-org/${response.body.id}`)

      // Verify organization was added to the database
      const orgs = await getAllGithubOrganizationsByProjectsId([projectId])
      expect(orgs.length).toBe(1)
      expect(orgs[0].html_url).toBe(githubOrgUrl.toLowerCase())
    })

    test('should correctly extract organization login from URL with trailing slash', async () => {
      const githubOrgUrl = 'https://github.com/expressjs/'

      const response = await app
        .post(`/api/v1/project/${projectId}/gh-org`)
        .send({ githubOrgUrl })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('login', 'expressjs')
      expect(response.body).toHaveProperty('html_url', githubOrgUrl.toLowerCase().replace(/\/$/, ''))
    })

    test('should correctly extract organization login from URL with query parameters', async () => {
      const githubOrgUrl = 'https://github.com/expressjs?tab=repositories'

      const response = await app
        .post(`/api/v1/project/${projectId}/gh-org`)
        .send({ githubOrgUrl })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('login', 'expressjs')
      // The stored URL should be normalized without query parameters
      expect(response.body.html_url).not.toContain('?')
    })

    test('should return 400 for invalid project ID', async () => {
      const response = await app
        .post('/api/v1/project/invalid/gh-org')
        .send({ githubOrgUrl: 'https://github.com/expressjs' })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'must be integer')
    })

    test('should return 400 for zero project ID', async () => {
      const response = await app
        .post('/api/v1/project/0/gh-org')
        .send({ githubOrgUrl: 'https://github.com/expressjs' })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'Invalid project ID. Must be a positive integer.')
    })

    test('should return 400 for negative project ID', async () => {
      const response = await app
        .post('/api/v1/project/-1/gh-org')
        .send({ githubOrgUrl: 'https://github.com/expressjs' })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'Invalid project ID. Must be a positive integer.')
    })

    test('should return 400 for invalid GitHub organization URL', async () => {
      const response = await app
        .post(`/api/v1/project/${projectId}/gh-org`)
        .send({ githubOrgUrl: 'https://invalid-url.com/org' })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'must match pattern "^https://github.com/[^/]+"')
    })

    test('should return 404 for project not found', async () => {
      const nonExistentProjectId = 9999999

      const response = await app
        .post(`/api/v1/project/${nonExistentProjectId}/gh-org`)
        .send({ githubOrgUrl: 'https://github.com/expressjs' })

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'Project not found')
    })

    test('should return 409 for duplicate GitHub organization', async () => {
      const githubOrgUrl = 'https://github.com/expressjs'

      // First add the organization
      await app
        .post(`/api/v1/project/${projectId}/gh-org`)
        .send({ githubOrgUrl })

      // Try to add it again
      const response = await app
        .post(`/api/v1/project/${projectId}/gh-org`)
        .send({ githubOrgUrl })

      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'GitHub organization already exists for this project')
    })

    test('should return 409 for duplicate GitHub organization with different case', async () => {
      // First add the organization with lowercase
      await app
        .post(`/api/v1/project/${projectId}/gh-org`)
        .send({ githubOrgUrl: 'https://github.com/expressjs' })

      // Try to add it again with uppercase
      const response = await app
        .post(`/api/v1/project/${projectId}/gh-org`)
        .send({ githubOrgUrl: 'https://github.com/ExpressJS' })

      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'GitHub organization already exists for this project')
    })

    test('should return 409 for duplicate GitHub organization with trailing slash', async () => {
      // First add the organization without trailing slash
      await app
        .post(`/api/v1/project/${projectId}/gh-org`)
        .send({ githubOrgUrl: 'https://github.com/expressjs' })

      // Try to add it again with trailing slash
      const response = await app
        .post(`/api/v1/project/${projectId}/gh-org`)
        .send({ githubOrgUrl: 'https://github.com/expressjs/' })

      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'GitHub organization already exists for this project')
    })

    test.todo('should return 500 for internal server error')
  })

  describe('GET /api/v1/compliance-check', () => {
    test('should return 200 and a list of checks', async () => {
      const response = await app.get('/api/v1/compliance-check')
      const storedChecks = await getAllChecks()

      expect(response.status).toBe(200)
      const expected = storedChecks.map(c => ({
        ...c,
        created_at: c.created_at.toISOString(),
        updated_at: c.updated_at.toISOString()
      }))
      expect(response.body).toStrictEqual(expected)
    })

    test.todo('should return 500 for internal server error')
  })

  describe('GET /api/v1/compliance-check/:checkId', () => {
    test('should return 200 and a check by ID', async () => {
      const response = await app.get('/api/v1/compliance-check/1')
      const storedCheck = await getCheckById(1)

      expect(response.status).toBe(200)
      const expected = {
        ...storedCheck,
        created_at: storedCheck.created_at.toISOString(),
        updated_at: storedCheck.updated_at.toISOString()
      }
      expect(response.body).toStrictEqual(expected)
    })

    test('should return 400 for invalid check ID', async () => {
      const response = await app.get('/api/v1/compliance-check/invalid')

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'must be integer')
    })

    test('should return 404 for check not found', async () => {
      const response = await app.get('/api/v1/compliance-check/9999999')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'Compliance Check not found')
    })

    test.todo('should return 500 for internal server error')
  })

  describe('GET /api/v1/compliance-checklist', () => {
    test('should return 200 and a list of checklists', async () => {
      const response = await app.get('/api/v1/compliance-checklist')
      const storedChecklists = await getAllChecklists()

      expect(response.status).toBe(200)
      const expected = storedChecklists.map(c => ({
        ...c,
        created_at: c.created_at.toISOString(),
        updated_at: c.updated_at.toISOString()
      }))
      expect(response.body).toStrictEqual(expected)
    })

    test.todo('should return 500 for internal server error')
  })

  describe('GET /api/v1/compliance-checklist/{checklistId}', () => {
    test('should return 200 and a specific checklist', async () => {
      const response = await app.get('/api/v1/compliance-checklist/1')
      const storedChecklist = await getChecklistById(1)

      expect(response.status).toBe(200)
      const expected = {
        ...storedChecklist,
        created_at: storedChecklist.created_at.toISOString(),
        updated_at: storedChecklist.updated_at.toISOString()
      }
      expect(response.body).toStrictEqual(expected)
    })

    test('should return 400 for invalid checklist ID', async () => {
      const response = await app.get('/api/v1/compliance-checklist/invalid')

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'must be integer')
    })

    test('should return 404 for invalid checklist ID', async () => {
      const response = await app.get('/api/v1/compliance-checklist/9999999')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'Compliance Checklist not found')
    })

    test.todo('should return 500 for internal server error')
  })

  describe('GET /api/v1/bulk-import', () => {
    test('should return 200 and a list of bulk import operations', async () => {
      const response = await app.get('/api/v1/bulk-import')
      const operations = getAllBulkImportOperations()

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual(operations)
    })

    test.todo('should return 500 for internal server error')
  })

  describe('POST /api/v1/bulk-import', () => {
    const operationId = getAllBulkImportOperations()[0].id
    let largePayload
    let validPayload
    let projectId

    beforeEach(async () => {
      // Create a test project for each test
      const project = await addProject({ name: 'test-project' })
      projectId = project.id
      largePayload = [{
        type: 'annualDependencyRefresh',
        project_id: projectId,
        is_subscribed: true
      }, {
        type: 'vulnResponse14Days',
        project_id: projectId,
        is_subscribed: true
      }, {
        type: 'incidentResponsePlan',
        project_id: projectId,
        is_subscribed: true
      }, {
        type: 'assignCVEForKnownVulns',
        project_id: projectId,
        is_subscribed: true
      }, {
        type: 'includeCVEInReleaseNotes',
        project_id: projectId,
        is_subscribed: true
      }]
      validPayload = [largePayload[0]]
    })

    test('should return 202 and a success message', async () => {
      // Check initial state
      let storedProject = await getProjectById(projectId)
      expect(storedProject.has_annualDependencyRefresh_policy).toBe(null)

      // Perform bulk import
      const response = await app
        .post('/api/v1/bulk-import')
        .send({ id: operationId, payload: validPayload })

      expect(response.status).toBe(202)
      expect(response.body).toHaveProperty('status', 'completed')
      expect(response.body).toHaveProperty('started')
      expect(response.body).toHaveProperty('finished')
      expect(response.body).toHaveProperty('result')
      expect(response.body.result).toHaveProperty('message', 'Bulk import completed successfully')
      expect(response.body.result).toHaveProperty('success', true)

      // Check final state
      storedProject = await getProjectById(projectId)
      expect(storedProject.has_annualDependencyRefresh_policy).toBe(true)
    })

    test('should return 202 and a success message (case: multiple updates)', async () => {
      // Check initial state
      let storedProject = await getProjectById(projectId)
      expect(storedProject.has_annualDependencyRefresh_policy).toBe(null)
      expect(storedProject.has_vulnResponse14Days_policy).toBe(null)
      expect(storedProject.has_incidentResponsePlan_policy).toBe(null)
      expect(storedProject.has_assignCVEForKnownVulns_policy).toBe(null)
      expect(storedProject.has_includeCVEInReleaseNotes_policy).toBe(null)

      // Perform bulk import
      const response = await app
        .post('/api/v1/bulk-import')
        .send({ id: operationId, payload: largePayload })

      expect(response.status).toBe(202)
      expect(response.body).toHaveProperty('status', 'completed')
      expect(response.body).toHaveProperty('started')
      expect(response.body).toHaveProperty('finished')
      expect(response.body).toHaveProperty('result')
      expect(response.body.result).toHaveProperty('message', 'Bulk import completed successfully')
      expect(response.body.result).toHaveProperty('success', true)

      // Check final state
      storedProject = await getProjectById(projectId)
      expect(storedProject.has_annualDependencyRefresh_policy).toBe(true)
      expect(storedProject.has_vulnResponse14Days_policy).toBe(true)
      expect(storedProject.has_incidentResponsePlan_policy).toBe(true)
      expect(storedProject.has_assignCVEForKnownVulns_policy).toBe(true)
      expect(storedProject.has_includeCVEInReleaseNotes_policy).toBe(true)
    })

    test('should return 400 for invalid payload (case: Swagger rejection)', async () => {
      const response = await app
        .post('/api/v1/bulk-import')
        .send({ id: operationId, payload: 'invalid' })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'must be object')
    })

    test('should return 400 for invalid payload (case: invalid payload against JSON Schema)', async () => {
      const response = await app
        .post('/api/v1/bulk-import')
        .send({ id: operationId, payload: [{ invalid: 'payload' }] })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'The data does not match the schema')
    })

    test('should return 404 for invalid operation ID', async () => {
      const response = await app
        .post('/api/v1/bulk-import')
        .send({ id: 'invalid', payload: validPayload })

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'Bulk import operation not found')
    })

    test('should return 500 if the request is not completed (due project not found)', async () => {
      const invalidPayload = validPayload.map(p => ({ ...p, project_id: 9999999 }))

      const response = await app
        .post('/api/v1/bulk-import')
        .send({ id: operationId, payload: invalidPayload })

      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('errors')
      expect(response.body.errors[0]).toHaveProperty('message', 'Failed to run bulk import: Operation failed for item type: annualDependencyRefresh, project_id: 9999999')
    })

    test.todo('should return 500 for internal server error')
  })
})
