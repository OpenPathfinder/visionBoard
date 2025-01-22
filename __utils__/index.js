const { initializeStore } = require('../src/store')
const resetDatabase = async (knex) => {
  await knex.raw('TRUNCATE TABLE software_design_training RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE owasp_top10_training RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE compliance_checks_results RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE compliance_checks_tasks RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE compliance_checks_alerts RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE github_repositories RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE github_organizations RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE projects RESTART IDENTITY CASCADE')
}

module.exports = {
  resetDatabase,
  initializeStore
}
