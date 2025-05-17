const { generateStaticReports } = require('../../reports')
const { logger } = require('../../utils')
const { initializeStore } = require('../../store')

function createApiRouter (knex, express) {
  const router = express.Router()

  router.get('/__health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  router.get('/checks', async (req, res) => {
    try {
      const { getAllComplianceChecks } = initializeStore(knex)
      const checks = await getAllComplianceChecks()
      res.json(checks)
    } catch (error) {
      logger.error(error)
      res.status(500).json({ status: 'Failed to fetch compliance checks' })
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
