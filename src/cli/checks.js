const { initializeStore } = require('../store')
const { logger } = require('../utils')

async function listCheckCommand (knex, options = {}) {
  const { getAllComplianceChecks } = initializeStore(knex)
  const checks = await getAllComplianceChecks(knex)
  const implementedChecks = checks.filter(check => check.implementation_status === 'completed')
  implementedChecks.forEach(check => {
    logger.log(`- ${check.code_name}: ${check.title}`)
  })
  logger.log('------------------------------------')
  logger.log(`Implemented checks: ${implementedChecks.length}/${checks.length}.`)
  return implementedChecks
}

module.exports = {
  listCheckCommand
}
