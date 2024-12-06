const project = require('./project')
const workflows = require('./workflows')
const checks = require('./checks')

module.exports = {
  ...project,
  ...workflows,
  ...checks
}
