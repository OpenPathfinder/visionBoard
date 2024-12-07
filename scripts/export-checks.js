const { writeFileSync } = require('fs')
const { getConfig } = require('../src/config')
const { dbSettings } = getConfig()
const knex = require('knex')(dbSettings)
const { join } = require('path')

;(async () => {
  const checks = await knex('compliance_checks').select()
  writeFileSync(join(process.cwd(), 'output', 'checks.json'), JSON.stringify(checks, null, 2))
  console.log('Checks exported to checks.json')
  await knex.destroy()
})()
