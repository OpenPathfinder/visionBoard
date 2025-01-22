exports.up = async (knex) => {
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
    table.string('mitre_url').nullable()
    table.string('mitre_description').nullable()
    table.string('how_to_url').nullable()
    table.string('how_to_description').nullable()
    table.string('sources_url').nullable()
    table.string('sources_description').nullable()
  })

  const initialResources = await knex.select('*')
    .from('compliance_checks_resources')
    .join('resources_for_compliance_checks', function () {
      this.on('compliance_checks_resources.id', '=', 'resources_for_compliance_checks.compliance_check_resource_id')
    })

  const groups = Object.groupBy(initialResources,
    ({ compliance_check_id }) => compliance_check_id
  )
  const upsertData = Object.keys(groups).map((groupKey) => {
    const groupsKey = groups[groupKey]
    const payload = {}
    const resources = groupsKey.reduce(
      (acc, { name, url, description }) => ({
        [name]: { url, description },
        ...acc
      }),
      {}
    )
    payload[groupKey] = { id: groupKey, ...resources }
    return { id: groupKey, ...resources }
  })

  const upserts = upsertData.map((doc) => {
    return knex('compliance_checks').where({ id: doc.id }).update({
      mitre_url: doc?.mitre?.url,
      mitre_description: doc?.mitre?.description,
      how_to_url: doc?.how_to?.url,
      how_to_description: doc?.how_to?.description,
      sources_url: doc?.sources?.url,
      sources_description: doc?.sources?.description
    })
  })
  await Promise.all(upserts)
}
