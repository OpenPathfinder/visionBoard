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
    if (!serverInstance) {
      console.log('No server instance running, exiting')
      process.exit(0)
      return
    }

    // Set a hard timeout to force exit if graceful shutdown takes too long
    const forceExitTimeout = setTimeout(() => {
      console.error('Shutdown timed out after 10 seconds, forcing exit')
      process.exit(1)
    }, 10000)

    try {
      await serverInstance.stop()
      clearTimeout(forceExitTimeout)
      console.log('Server stopped successfully')
      // Small delay to ensure logs are flushed
      setTimeout(() => process.exit(0), 100)
    } catch (error) {
      clearTimeout(forceExitTimeout)
      console.error('Error during shutdown:', error)
      process.exit(1)
    }
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
})()
