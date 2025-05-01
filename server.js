const server = require('./src/httpServer');

(async () => {
  const serverInstance = server()
  await serverInstance.start()
})()
