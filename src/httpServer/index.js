const express = require('express')
const http = require('http')
const serveStatic = require('serve-static')
const serveIndex = require('serve-index')
const { join } = require('path')
const { getConfig } = require('../config')
const { logger, checkDatabaseConnection } = require('../utils')
const { createApiRouter } = require('./routers/apiV1')
const { createWebRouter } = require('./routers/website')
const publicPath = join(process.cwd(), 'src', 'reports', 'assets')
const { staticServer, dbSettings } = getConfig()
const knex = require('knex')(dbSettings)

// Create Express app
const app = express()
const templatePath = join(process.cwd(), 'src', 'reports', 'templates')

// Middleware
app.set('view engine', 'ejs')
app.set('views', templatePath)

// API Routes
app.use('/api/v1', createApiRouter(knex, express))

// Web Routes
app.use('/', createWebRouter(knex, express))

// Static file serving
app.use('/assets', serveStatic(publicPath, {
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

// Track all active connections
const connections = new Set()

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

    // Track connections
    server.on('connection', connection => {
      connections.add(connection)
      connection.on('close', () => {
        connections.delete(connection)
      })
    })
    return server
  },
  stop: async () => {
    logger.info('Starting server shutdown sequence')
    try {
      logger.info('Closing database connections')
      await knex.destroy()
      logger.info('Database connections closed')

      // Check if server is listening before attempting to close
      if (!server.listening) {
        logger.info('Server was not listening, skipping server.close()')
        return
      }

      logger.info('Closing HTTP server')
      // Terminate all existing connections
      if (connections.size > 0) {
        logger.info(`Forcibly closing ${connections.size} active connections`)
        for (const connection of connections) {
          connection.destroy()
        }
        connections.clear()
      }

      await new Promise((resolve, reject) => {
        // Add a timeout to prevent hanging indefinitely
        const timeout = setTimeout(() => {
          logger.warn('Server close timed out after 5 seconds, forcing shutdown')
          resolve()
        }, 5000)

        server.close(err => {
          clearTimeout(timeout)
          if (err) {
            logger.error('Failed to stop server', { err })
            return reject(err)
          }
          logger.info('HTTP server closed successfully')
          resolve()
        })
      })
      logger.info('Server shutdown complete')
    } catch (error) {
      logger.error('Error during server shutdown', { error })
      throw error
    }
  }
})
