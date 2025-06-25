const pkg = require('../../../package.json')
const { logger, validateGithubUrl } = require('../../utils')
const { initializeStore } = require('../../store')
const _ = require('lodash')
const { isSlug } = require('validator')
const { getWorkflowsDetails } = require('../../workflows')
const { getAllBulkImportOperations, bulkImport } = require('../../importers')
const { validateBulkImport } = require('../../schemas')

const HTTP_DEFAULT_TIMEOUT = 30 * 1000 // 30 seconds

const runWorkflow = ({ workflowName, knex, data } = {}) => new Promise((resolve, reject) => {
  const { workflows } = getWorkflowsDetails()
  const workflow = workflows[workflowName]
  if (!workflow || typeof workflow.workflow !== 'function') {
    return reject(new Error('Invalid Workflow'))
  }
  // @TODO: This is temporary and ideally we should move this to a queue system
  // to avoid blocking the HTTP server and allow long-running workflows
  const timeout = setTimeout(() => {
    reject(new Error('Workflow default timeout reached'))
  }, HTTP_DEFAULT_TIMEOUT)

  Promise.resolve()
    .then(() => workflow.workflow(knex, data))
    .then(() => resolve(workflow))
    .catch(err => reject(new Error(`Failed to run workflow: ${err.message}`)))
    .finally(() => clearTimeout(timeout))
})

function createApiRouter (knex, express) {
  const { addProject, getProjectByName, addGithubOrganization, getProjectById, getAllGithubOrganizationsByProjectsId, getAllChecks, getCheckById, getAllChecklists, getChecklistById } = initializeStore(knex)

  const router = express.Router()

  router.get('/__health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: pkg.version, name: pkg.name })
  })

  router.post('/project/:projectId/gh-org', async (req, res) => {
    // Parse projectId with explicit radix 10 to avoid issues with leading zeros
    const projectId = parseInt(req.params.projectId, 10)
    const { githubOrgUrl } = req.body

    // Stricter validation: check for NaN, non-integers, and non-positive values
    if (isNaN(projectId) || !Number.isInteger(projectId) || projectId <= 0) {
      return res.status(400).json({ errors: [{ message: 'Invalid project ID. Must be a positive integer.' }] })
    }
    if (!githubOrgUrl || !validateGithubUrl(githubOrgUrl)) {
      return res.status(400).json({ errors: [{ message: 'Invalid GitHub organization name' }] })
    }

    const project = await getProjectById(projectId)
    if (!project) {
      return res.status(404).json({ errors: [{ message: 'Project not found' }] })
    }

    // Normalize the input URL by parsing it with URL object
    // This allows us to handle different protocols, query parameters, and trailing slashes
    const urlObj = new URL(githubOrgUrl)
    // Create a normalized URL: lowercase, no trailing slash, no query parameters
    const normalizedGithubOrgUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname.replace(/\/$/, '')}`.toLowerCase()

    const existingGhOrg = await getAllGithubOrganizationsByProjectsId([projectId])
    if (existingGhOrg.some(org => {
      try {
        // Apply the same normalization to stored URLs for consistent comparison
        const storedUrl = new URL(org.html_url)
        const normalizedStoredUrl = `${storedUrl.protocol}//${storedUrl.host}${storedUrl.pathname.replace(/\/$/, '')}`.toLowerCase()
        return normalizedStoredUrl === normalizedGithubOrgUrl
      } catch (e) {
        // Fallback to simple comparison if URL parsing fails
        return org.html_url.toLowerCase().replace(/\/$/, '') === normalizedGithubOrgUrl
      }
    })) {
      return res.status(409).json({ errors: [{ message: 'GitHub organization already exists for this project' }] })
    }

    try {
      // Get the pathname from the already created URL object, remove leading/trailing slashes, and take the first segment
      const login = urlObj.pathname.replace(/^\/|\/$/, '').split('/')[0]

      const org = await addGithubOrganization({
        html_url: normalizedGithubOrgUrl,
        login,
        project_id: project.id
      })

      return res.status(201)
        .header('Location', `/api/v1/project/${projectId}/gh-org/${org.id}`)
        .json(org)
    } catch (err) {
      logger.error(err)
      return res.status(500).json({ errors: [{ message: 'Internal server error' }] })
    }
  })

  router.post('/project', async (req, res) => {
    try {
      // Validate request body
      const { name } = req.body
      const projectName = _.kebabCase(name)

      // Check data and database
      if (!projectName || !isSlug(projectName)) {
        return res.status(400).json({ errors: [{ message: 'Invalid project name. Must be a slug.' }] })
      }
      const existingProject = await getProjectByName(projectName)
      if (existingProject) {
        return res.status(409).json({ errors: [{ message: 'Project already exists.' }] })
      }

      // Modify database
      const project = await addProject({ name: projectName })

      // Return response
      return res.status(201)
        .header('Location', `/api/v1/project/${project.id}`)
        .json(project)
    } catch (err) {
      logger.error(err)
      return res.status(500).json({ errors: [{ message: 'Internal server error' }] })
    }
  })

  router.get('/compliance-check/:checkId', async (req, res) => {
    try {
      // Params validation done in swagger
      const checkId = parseInt(req.params.checkId, 10)
      const check = await getCheckById(checkId)
      if (!check) {
        return res.status(404).json({ errors: [{ message: 'Compliance Check not found' }] })
      }
      res.json(check)
    } catch (error) {
      logger.error(error)
      res.status(500).json({ errors: [{ message: 'Failed to retrieve Compliance Check' }] })
    }
  })

  router.get('/compliance-check', async (req, res) => {
    try {
      const checks = await getAllChecks()
      res.json(checks)
    } catch (error) {
      logger.error(error)
      res.status(500).json({ errors: [{ message: 'Failed to retrieve Compliance Checks' }] })
    }
  })

  router.get('/compliance-checklist/:checklistId', async (req, res) => {
    try {
      // Params validation done in swagger
      const checklistId = parseInt(req.params.checklistId, 10)
      const checklist = await getChecklistById(checklistId)
      if (!checklist) {
        return res.status(404).json({ errors: [{ message: 'Compliance Checklist not found' }] })
      }
      res.json(checklist)
    } catch (error) {
      logger.error(error)
      res.status(500).json({ errors: [{ message: 'Failed to retrieve Compliance Checklist' }] })
    }
  })

  router.get('/compliance-checklist', async (req, res) => {
    try {
      const checklists = await getAllChecklists()
      res.json(checklists)
    } catch (error) {
      logger.error(error)
      res.status(500).json({ errors: [{ message: 'Failed to retrieve Compliance Checklists' }] })
    }
  })

  router.get('/workflow', (req, res) => {
    try {
      const { workflowsList } = getWorkflowsDetails()
      res.json(workflowsList)
    } catch (error) {
      logger.error(error)
      res.status(500).json({ errors: [{ message: 'Failed to retrieve workflows' }] })
    }
  })

  router.post('/workflow/:id/execute', async (req, res) => {
    const { id } = req.params
    const { data } = req.body
    const { workflows } = getWorkflowsDetails()

    if (!id || !isSlug(id)) {
      return res.status(400).json({ errors: [{ message: 'Invalid workflow ID' }] })
    }
    const workflow = workflows[id]

    if (!workflow) {
      return res.status(404).json({ errors: [{ message: 'Workflow not found' }] })
    }

    if (!workflow.isEnabled) {
      return res.status(403).json({ errors: [{ message: 'Workflow is disabled' }] })
    }

    if (workflow.isRequiredAdditionalData && !data) {
      return res.status(400).json({ errors: [{ message: 'Additional data is required' }] })
    }

    try {
      // @TODO: We need to delegate the workflow execution to a worker and provide and endpoint to check the status
      // This is a temporary solution to run the workflow within the HTTP timeout
      // data validation is done in the workflow itself
      const started = new Date().toISOString()
      // @TODO: Improve errors handling
      await runWorkflow({ workflowName: id, knex, data })
      const finished = new Date().toISOString()
      res.status(202).json({ status: 'completed', started, finished, result: { message: 'Workflow completed successfully', success: true } })
    } catch (error) {
      logger.error(error)
      res.status(500).json({
        status: 'failed',
        workflow: workflow
          ? { id, description: workflow.description }
          : undefined,
        errors: [{ message: `Failed to run workflow: ${error.message}` }]
      })
    }
  })

  router.get('/bulk-import', async (req, res) => {
    try {
      const operations = getAllBulkImportOperations()
      res.json(operations)
    } catch (error) {
      logger.error(error)
      res.status(500).json({ errors: [{ message: 'Failed to retrieve bulk import operations' }] })
    }
  })

  router.post('/bulk-import', async (req, res) => {
    try {
      const { id, payload } = req.body
      const operation = getAllBulkImportOperations().find((op) => op.id === id)

      if (!operation) {
        return res.status(404).json({ errors: [{ message: 'Bulk import operation not found' }] })
      }
      const started = new Date().toISOString()

      try {
        validateBulkImport(payload)
      } catch (error) {
        logger.error('Error validating the user data against the schema')
        return res.status(400).json({ errors: [{ message: 'The data does not match the schema' }] })
      }

      await bulkImport({ operationId: id, knex, data: payload })
      const finished = new Date().toISOString()
      res.status(202).json({ status: 'completed', started, finished, result: { message: 'Bulk import completed successfully', success: true } })
    } catch (error) {
      logger.error(error)
      res.status(500).json({
        status: 'failed',
        errors: [{ message: `Failed to run bulk import: ${error.message}` }]
      })
    }
  })

  return router
}

module.exports = { createApiRouter }
