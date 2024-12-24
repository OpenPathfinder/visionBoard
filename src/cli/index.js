const project = require('./project')
const workflows = require('./workflows')
const checks = require('./checks')
const checklists = require('./checklists')

module.exports = {
  ...project,
  ...workflows,
  ...checks,
  ...checklists
}
