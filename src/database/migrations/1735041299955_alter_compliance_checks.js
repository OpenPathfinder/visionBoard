const statusLevels = ['n/a', 'deferrable', 'expected', 'recommended']

exports.up = async (knex) => {
  await knex.schema.alterTable('compliance_checks', (table) => {
    // Drop old fields
    table.dropColumn('level_incubating_status')
    table.dropColumn('level_active_status')
    table.dropColumn('level_retiring_status')

    // Rename fields
    table.renameColumn('priority_group', 'default_priority_group')
    table.renameColumn('section_number', 'default_section_number')
    table.renameColumn('section_name', 'default_section_name')
  })
}

exports.down = async (knex) => {
  await knex.schema.alterTable('compliance_checks', (table) => {
    // IMPORTANT: Re-add dropped fields but without the original values and nullable.
    table.enum('level_incubating_status', statusLevels).nullable()
    table.enum('level_active_status', statusLevels).nullable()
    table.enum('level_retiring_status', statusLevels).nullable()

    // Rename fields back
    table.renameColumn('default_priority_group', 'priority_group')
    table.renameColumn('default_section_number', 'section_number')
    table.renameColumn('default_section_name', 'section_name')
  })
}
