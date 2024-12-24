exports.up = async (knex) => {
  await knex.schema.createTable('compliance_checklists', (table) => {
    table.increments('id').primary() // Primary key
    table.text('author').notNullable()
    table.string('title').notNullable()
    table.text('description').notNullable()
    table.string('code_name').notNullable()
    table.text('url').notNullable()

    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })

  // Add trigger to automatically update the 'updated_at' column
  await knex.raw(`
        CREATE TRIGGER set_updated_at_compliance_checklists
        BEFORE UPDATE ON compliance_checklists
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `)
}

exports.down = async (knex) => {
  // Drop trigger
  await knex.raw('DROP TRIGGER IF EXISTS set_updated_at_compliance_checklists ON compliance_checklists;')
  // Drop table
  await knex.schema.dropTableIfExists('compliance_checklists')
}
