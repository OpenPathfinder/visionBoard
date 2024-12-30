const finalhandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')
const serveIndex = require('serve-index')
const { join } = require('path')
const { getConfig } = require('../config')
const { logger } = require('../utils')

const publicPath = join(process.cwd(), 'output')
const { staticServer } = getConfig()

const serve = serveStatic(publicPath, {
  index: false,
  dotfiles: 'deny'
})

const serveDirectory = serveIndex(publicPath, { icons: true })

const server = http.createServer(function onRequest (req, res) {
  serve(req, res, function (err) {
    if (err) return finalhandler(req, res)(err)
    // Directory listing
    serveDirectory(req, res, finalhandler(req, res))
  })
})

module.exports = () => server.listen(staticServer.port, () => {
  logger.info(`Server running at http://${staticServer.ip}:${staticServer.port}/`)
})
