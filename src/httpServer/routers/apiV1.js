const { generateStaticReports } = require('../../reports')
const pkg = require('../../../package.json')
const { logger } = require('../../utils')
const { initializeStore } = require('../../store')
const _ = require('lodash')
const { isSlug } = require('validator')
const { getWorkflowsDetails } = require('../../cli/workflows')

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
  const { addProject, getProjectByName } = initializeStore(knex)

  const router = express.Router()

  router.get('/__health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: pkg.version, name: pkg.name })
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

  router.get('/workflow', (req, res) => {
    try {
      const { workflowsList } = getWorkflowsDetails()
      res.json(workflowsList)
    } catch (error) {
      logger.error(error)
      res.status(500).json({ errors: [{ message: 'Failed to retrieve workflows' }] })
    }
  })

  router.post('/workflow/:id/run', async (req, res) => {
    const { id } = req.params
    const data = req.body
    const { workflows } = getWorkflowsDetails()

    if (!id || !isSlug(id)) {
      return res.status(400).json({ errors: [{ message: 'Invalid workflow ID' }] })
    }
    const workflow = workflows[id]

    if (!workflow) {
      return res.status(404).json({ errors: [{ message: 'Workflow not found' }] })
    }
    try {
      // @TODO: We need to delegate the workflow execution to a worker and provide and endpoint to check the status
      // This is a temporary solution to run the workflow within the HTTP timeout
      // data validation is done in the workflow itself
      const wf = await runWorkflow({ workflowName: id, knex, data })
      res.status(202).json({ status: 'completed', workflow: { id, description: wf.description } })
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

  router.post('/generate-reports', async (req, res) => {
    const startTs = new Date().toISOString()
    try {
      await generateStaticReports(knex, { clearPreviousReports: true })
      res.status(202).json({
        status: 'completed',
        startedAt: startTs,
        finishedAt: new Date().toISOString()
      })
    } catch (error) {
      logger.error(error)
      res.status(500).json({
        status: 'failed',
        startedAt: startTs,
        finishedAt: new Date().toISOString()
      })
    }
  })
  return router
}

module.exports = { createApiRouter }
