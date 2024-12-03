const { getConfig } = require('./src/config')

const { dbSettings } = getConfig()

module.exports = {
  development: dbSettings
}
