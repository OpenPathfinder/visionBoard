const { generateStaticReports } = require('../reports')
const { logger } = require('../utils')

/**
 * Creates and returns an Express router with health check and report generation endpoints.
 *
 * The router provides:
 * - `GET /__health`: Returns a JSON object indicating service health and the current timestamp.
 * - `POST /generate-reports`: Initiates static report generation and responds with the operation status and timestamps.
 *
 * @returns {import('express').Router} An Express router with health check and report generation routes.
 */
function createApiRouter (knex, express) {
  const router = express.Router()

  router.get('/__health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
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
