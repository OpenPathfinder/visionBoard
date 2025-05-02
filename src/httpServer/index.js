const express = require('express')
const http = require('http')
const serveStatic = require('serve-static')
const serveIndex = require('serve-index')
const { join } = require('path')
const { getConfig } = require('../config')
const { logger, checkDatabaseConnection } = require('../utils')
const { createApiRouter } = require('./routers/apiV1')

const publicPath = join(process.cwd(), 'src', 'reports', 'assets')
const { staticServer, dbSettings } = getConfig()
const knex = require('knex')(dbSettings)

// Create Express app
const app = express()

// API Routes
app.use('/api/v1', createApiRouter(knex, express))

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

// Create HTTP server
const server = http.createServer(app)

module.exports = () => ({
  start: async () => {
    const isDbConnected = await checkDatabaseConnection(knex)
    if (!isDbConnected) {
      const err = new Error('Failed to connect to database')
      logger.error(err)
      throw err
    }
    await new Promise((resolve, reject) => {
      server.listen(staticServer.port, err => {
        if (err) return reject(err)
        logger.info(`Server running at http://${staticServer.ip}:${staticServer.port}/`)
        logger.info(`API available at http://${staticServer.ip}:${staticServer.port}/api/v1/`)
        resolve()
      })
    })
    return server
  },
  stop: async () => {
    await knex.destroy()
    await new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          logger.error('Failed to stop server', { err })
          return reject(err)
        }
        logger.info('Server stopped')
        resolve()
      })
    })
  }
})
