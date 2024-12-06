const statusLevels = ['n/a', 'deferrable', 'expected', 'recommended']

exports.up = async (knex) => {
  await knex.schema.createTable('compliance_checks', (table) => {
    table.increments('id').primary() // Primary key
    table.string('title').notNullable()
    table.text('description').notNullable()
    table.string('section_number').notNullable()
    table.string('section_name').notNullable()
    table.string('code_name').unique().notNullable()
    table.string('priority_group').notNullable()
    table.boolean('is_c_scrm').notNullable().defaultTo(false)
    table.enum('level_incubating_status', statusLevels).notNullable()
    table.enum('level_active_status', statusLevels).notNullable()
    table.enum('level_retiring_status', statusLevels).notNullable()
    table.string('mitre_url')
    table.string('mitre_description')
    table.string('how_to_url')
    table.text('how_to_description')
    table.string('sources_url')
    table.text('sources_description')
    table.enum('implementation_status', ['pending', 'completed']).notNullable().defaultTo('pending')
    table.enum('implementation_type', ['manual', 'computed'])
    table.text('implementation_details_reference')
    table.text('details_url').notNullable()

    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })

  // Add trigger to automatically update the 'updated_at' column
  await knex.raw(`
      CREATE TRIGGER set_updated_at_compliance_checks
      BEFORE UPDATE ON compliance_checks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `)
}

exports.down = async (knex) => {
  // Drop trigger
  await knex.raw('DROP TRIGGER IF EXISTS set_updated_at_compliance_checks ON compliance_checks;')
  // Drop table
  await knex.schema.dropTableIfExists('compliance_checks')
}
