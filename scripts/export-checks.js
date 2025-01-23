const { writeFileSync } = require('fs')
const { getConfig } = require('../src/config')
const { dbSettings } = getConfig()
const knex = require('knex')(dbSettings)
const { join } = require('path')

;(async () => {
  const checks = await knex('compliance_checks')
    .leftJoin('resources_for_compliance_checks', 'compliance_checks.id', 'resources_for_compliance_checks.compliance_check_id')
    .leftJoin('compliance_checks_resources', 'resources_for_compliance_checks.compliance_check_resource_id', 'compliance_checks_resources.id')
    .select(
      'compliance_checks.*',
      knex.raw(`
        json_agg(
          json_build_object(
            'type', compliance_checks_resources.type,
            'url', compliance_checks_resources.url,
            'name', compliance_checks_resources.name
          )
        ) as resources
      `)
    )
    .groupBy('compliance_checks.id')

  const formattedChecks = checks.map(check => {
    const resources = check.resources.reduce((acc, resource) => {
      if (!acc[resource.type]) {
        acc[resource.type] = []
      }
      acc[resource.type].push({ url: resource.url, name: resource.name })
      return acc
    }, { mitre: [], how_to: [], sources: [] })

    return { ...check, resources }
  })

  writeFileSync(join(process.cwd(), 'output', 'checks.json'), JSON.stringify(formattedChecks, null, 2))
  console.log('Checks exported to checks.json')
  await knex.destroy()
})()
