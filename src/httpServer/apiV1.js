const { generateStaticReports } = require('../reports')
const { logger } = require('../utils')

function createApiRouter (knex, express) {
  const router = express.Router()

  router.get('/__health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  router.get('/generate-reports', async (req, res) => {
    const timestamp = new Date().toISOString()
    try {
      await generateStaticReports(knex, { clearPreviousReports: true })
      res.json({ status: 'completed', timestamp })
    } catch (error) {
      logger.error(error)
      res.status(500).json({ status: 'failed', timestamp })
    }
  })
  return router
}

module.exports = { createApiRouter }
