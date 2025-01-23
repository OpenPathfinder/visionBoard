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
  // IMPORTANT: Re-add dropped fields but without the original values and nullable.
  await knex.schema.alterTable('compliance_checks', (table) => {
    table.string('mitre_url').nullable()
    table.string('mitre_description').nullable()
    table.string('how_to_url').nullable()
    table.string('how_to_description').nullable()
    table.string('sources_url').nullable()
    table.string('sources_description').nullable()
  })
}
