let initialResources = []

exports.up = async (knex) => {
  initialResources = await knex('compliance_checks').select(
    'id as compliance_check_id',
    'mitre_url',
    'mitre_description',
    'how_to_url',
    'how_to_description',
    'sources_url',
    'sources_description'
  )
  // TODO Populate compliance_check_resources
  const data = initialResources.flatMap((resource) => {
    return [
      {
        tmp_compliance_check_id: resource.compliance_check_id,
        url: resource.mitre_url,
        description: resource.mitre_description,
        name: 'mitre'
      },
      {
        tmp_compliance_check_id: resource.compliance_check_id,
        url: resource.how_to_url,
        description: resource.how_to_description,
        name: 'how_to'
      },
      {
        tmp_compliance_check_id: resource.compliance_check_id,
        url: resource.sources_url,
        description: resource.sources_description,
        name: 'sources'
      }
    ]
  })
  const complianceCheckResourceIds = await knex('compliance_checks_resources')
    .insert(data.filter(d => d.url != null), ['id', 'tmp_compliance_check_id'])

  const fkIds = complianceCheckResourceIds.reduce((acc, checkResource, index) => {
    acc.push({
      compliance_check_id: checkResource.tmp_compliance_check_id,
      compliance_check_resource_id: checkResource.id
    })
    return acc
  }, [])
  await knex('resources_for_compliance_checks').insert(fkIds)

  await knex.schema.alterTable('compliance_checks_resources', (table) => {
    table.dropColumn('tmp_compliance_check_id')
  })
}

exports.down = async (knex) => {
  await knex('compliance_checks_resources').truncate()
  await knex('resources_for_compliance_checks').truncate()
}
