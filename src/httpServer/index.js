const express = require('express')
const http = require('http')
const serveStatic = require('serve-static')
const { join } = require('path')
const { getConfig } = require('../config')
const { logger, checkDatabaseConnection } = require('../utils')
const { createApiRouter } = require('./routers/apiV1')
const { createWebRouter } = require('./routers/website')
const { staticServer, dbSettings } = getConfig()
const knex = require('knex')(dbSettings)
const swaggerValidator = require('swagger-endpoint-validator')

// Track all active connections
const connections = new Set()
let server = null

async function initializeServer () {
// Create Express app
  const app = express()
  const basePath = join(__dirname, '..', 'reports')
  const publicPath = join(basePath, 'assets')
  const templatePath = join(basePath, 'templates')
  const swaggerFile = join(__dirname, 'swagger/api-v1.yml')

  // Middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.set('view engine', 'ejs')
  app.set('views', templatePath)

  // Initialize Swagger
  await swaggerValidator.init(app, {
    apiDocEndpoint: '/api/docs',
    format: 'yaml',
    yaml: {
      file: swaggerFile
    },
    beautifyErrors: true,
    validateResponses: true,
    validateRequests: true,
    // Validate only real API calls (everything under /api/v1/**)
    ignorePaths: /^\/(?!api\/v1\/).*/
  })
  logger.info('Swagger validation initialized successfully')

  // API Routes
  app.use('/api/v1', createApiRouter(knex, express))

  // Web Routes
  app.use('/', createWebRouter(knex, express))

  // Directory listing for static files
  app.use('/assets', serveStatic(publicPath, {
    index: false,
    dotfiles: 'deny'
  }))

  // Error handling middleware
  app.use((err, req, res, next) => {
    logger.error(`Server error: ${err.message}`, { stack: err.stack })
    if (res.headersSent) return next(err)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Check server logs for more details'
    })
  })

  // Create HTTP server
  const serverInstance = http.createServer(app)

  // Set up connection tracking once (prevents listener leaks on multiple start/stop cycles)
  serverInstance.on('connection', connection => {
    connections.add(connection)
    connection.on('close', () => connections.delete(connection))
  })

  return serverInstance
}

module.exports = () => ({
  start: async () => {
    server = await initializeServer()
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
        logger.info(`Swagger documentation available at http://${staticServer.ip}:${staticServer.port}/api/docs`)
        resolve()
      })
    })

    return server
  },
  stop: async () => {
    logger.info('Starting server shutdown sequence')
    try {
      if (!server) {
        logger.info('Server was not initialized, skipping shutdown sequence')
        return
      }
      // Check if server is listening before attempting to close
      if (!server.listening) {
        logger.info('Server was not listening, skipping server.close()')
      } else {
        logger.info('Closing HTTP server - stop accepting new connections')
        // Terminate all existing connections if needed
        if (connections.size > 0) {
          logger.info(`${connections.size} active connections will be allowed to complete`)
        }

        // First, stop accepting new connections and wait for existing ones to complete
        await new Promise((resolve, reject) => {
          // Add a timeout to prevent hanging indefinitely
          const timeout = setTimeout(() => {
            logger.warn('Server close timed out after 5 seconds, forcing active connections to close')
            // Force close any remaining connections
            if (connections.size > 0) {
              logger.info(`Forcibly closing ${connections.size} remaining connections`)
              for (const connection of connections) {
                connection.destroy()
              }
              connections.clear()
            }
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
      }

      // Only after the server is closed, close database connections
      logger.info('Closing database connections')
      await knex.destroy()
      logger.info('Database connections closed')

      logger.info('Server shutdown complete')
    } catch (error) {
      logger.error('Error during server shutdown', { error })
      throw error
    }
  }
})
