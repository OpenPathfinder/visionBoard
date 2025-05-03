const { logger } = require('../../utils')
const { collectIndexData, collectProjectData } = require('../../reports')
const { initializeStore } = require('../../store')

const indexTemplate = 'index'
const projectTemplate = 'project'
const notFoundTemplate = 'notFound'

function createWebRouter (knex, express) {
  const router = express.Router()
  const { getProjectById } = initializeStore(knex)

  router.get('/', async (req, res) => {
    try {
      const data = await collectIndexData(knex)
      res.render(indexTemplate, data)
    } catch (error) {
      logger.error(error)
      res.status(500).send('Error rendering index page')
    }
  })

  router.get('/projects/:id', async (req, res) => {
    const projectId = Number(req.params.id)
    if (isNaN(projectId)) {
      logger.error(`Invalid project ID: ${req.params.id}`)
      return res.status(404).render(notFoundTemplate)
    }
    try {
      const project = await getProjectById(projectId)
      if (!project) {
        logger.error(`Project not found: ${projectId}`)
        return res.status(404).render(notFoundTemplate)
      }
      const data = await collectProjectData(knex, projectId)
      res.render(projectTemplate, data)
    } catch (error) {
      logger.error(error)
      res.status(500).send('Error rendering project page')
    }
  })
  return router
}

module.exports = { createWebRouter }
