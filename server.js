const server = require('./src/httpServer');

(async () => {
  const serverInstance = server()
  try {
    await serverInstance.start()
    console.log('Server started successfully')
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }

  // Handle graceful shutdown
  const shutdown = async (signal) => {
    console.log(`Received ${signal}, shutting down gracefully...`)
    try {
      await serverInstance.stop()
      console.log('Server stopped successfully')
      process.exit(0)
    } catch (error) {
      console.error('Error during shutdown:', error)
      process.exit(1)
    }
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
})()
