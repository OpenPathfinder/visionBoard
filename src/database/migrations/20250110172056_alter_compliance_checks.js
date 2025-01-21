let initialResources = []

exports.up = async (knex) => {
  initialResources = await knex('compliance_checks').select(
    'id',
    'mitre_url',
    'mitre_description',
    'how_to_url',
    'how_to_description',
    'sources_url',
    'sources_description'
  )

  await knex.schema.alterTable('compliance_checks', (table) => {
    // Drop old fields
    table.dropColumn('mitre_url')
    table.dropColumn('mitre_description')
    table.dropColumn('how_to_url')
    table.dropColumn('how_to_description')
    table.dropColumn('sources_url')
    table.dropColumn('sources_description')
  })
}

exports.down = async (knex) => {
  await knex.schema.alterTable('compliance_checks', (table) => {
    // Add back old fields with new names
    table.string('mitre_url').nullable()
    table.string('mitre_description').nullable()
    table.string('how_to_url').nullable()
    table.string('how_to_description').nullable()
    table.string('sources_url').nullable()
    table.string('sources_description').nullable()
  })

  const checkResources = await knex.select('*').from('compliance_checks_resources')
  initialResources = await knex.select('*')
    .from('compliance_checks_resources')
    .join('resources_for_compliance_checks', function () {
      this.on('compliance_checks_resources.id', '=', 'resources_for_compliance_checks.compliance_check_resource_id')
    })

  const upserts = initialResources.map((resource) => {
    return knex('compliance_checks')
      .where({ id: resource.compliance_check_id })
      .update({
        mitre_url: resource.mitre_url,
        mitre_description: resource.mitre_description,
        how_to_url: resource.how_to_url,
        how_to_description: resource.how_to_description,
        sources_url: resource.sources_url,
        sources_description: resource.sources_description
      })
  })
  await Promise.all(upserts)
}
