const { readdirSync } = require('fs')
const { join } = require('path')
const debug = require('debug')('checks:index')

// This will load all the files in the complianceChecks directory and export them as an object. It works similar to require-all
debug('Loading compliance check files...')
const checksPath = join(__dirname, 'complianceChecks')
const files = readdirSync(checksPath)
const jsFiles = files.filter(file => file.endsWith('.js'))
const checks = {}
for (const file of jsFiles) {
  debug(`Loading ${file}...`)
  const [fileName] = file.split('.')
  const fileContent = require(join(checksPath, file))
  checks[fileName] = fileContent
}

debug('Checks files loaded')

module.exports = checks
