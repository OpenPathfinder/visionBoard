exports.up = async (knex) => {
  await knex.schema.createTable('compliance_checks_resources', (table) => {
    table.increments('id').primary() // Primary key
    table.string('url').notNullable()
    table.string('name')
    table.text('description')
    table.enum('type', ['mitre', 'how_to', 'sources']).notNullable().defaultTo('pending')

    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })

  await knex.raw(`
        CREATE TRIGGER set_updated_at_compliance_checks_resources
        BEFORE UPDATE ON compliance_checks_resources
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `)
}

exports.down = async (knex) => {
  // Drop trigger
  await knex.raw(`DROP TRIGGER IF EXISTS set_updated_at_compliance_checks_resources 
                  ON compliance_checks_resources;`)
  // Drop table
  await knex.schema.dropTableIfExists('compliance_checks_resources')
}
