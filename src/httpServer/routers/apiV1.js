const { generateStaticReports } = require('../../reports')
const pkg = require('../../../package.json')
const { logger } = require('../../utils')
const { initializeStore } = require('../../store')
const _ = require('lodash')
const { isSlug } = require('validator')
const { getAllWorkflows } = require('../../cli/workflows')

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

  router.get('/workflows', (req, res) => {
    try {
      const workflows = getAllWorkflows()
      res.json(workflows)
    } catch (error) {
      logger.error(error)
      res.status(500).json({ errors: [{ message: 'Failed to retrieve workflows' }] })
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
