const express = require('express')
const http = require('http')
const serveStatic = require('serve-static')
const serveIndex = require('serve-index')
const { join } = require('path')
const { getConfig } = require('../config')
const { logger } = require('../utils')

const publicPath = join(process.cwd(), 'output')
const { staticServer } = getConfig()

// Create Express app
const app = express()

// API Routes
app.use('/api/v1', createApiRouter())

// Static file serving
app.use(serveStatic(publicPath, {
  index: false,
  dotfiles: 'deny'
}))

// Directory listing for static files
app.use(serveIndex(publicPath, { icons: true }))

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Server error: ${err.message}`, { stack: err.stack })
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Check server logs for more details'
  })
})

// Create API router
function createApiRouter () {
  const router = express.Router()

  // Health check endpoint
  router.get('/__health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })
  return router
}

// Create HTTP server
const server = http.createServer(app)

module.exports = () => server.listen(staticServer.port, () => {
  logger.info(`Server running at http://${staticServer.ip}:${staticServer.port}/`)
  logger.info(`API available at http://${staticServer.ip}:${staticServer.port}/api/v1/`)
})
