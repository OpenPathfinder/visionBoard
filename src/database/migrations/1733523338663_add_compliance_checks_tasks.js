const severityLevels = ['critical', 'high', 'medium', 'low', 'info']

exports.up = async (knex) => {
  await knex.schema.createTable('compliance_checks_tasks', (table) => {
    table.increments('id').primary() // Primary key
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.enum('severity', severityLevels).notNullable()

    // Foreign key to 'compliance_checks' table
    table
      .integer('compliance_check_id')
      .unsigned()
      .references('id')
      .inTable('compliance_checks')
      .onDelete('CASCADE') // Deletes repository if the organization is deleted
      .onUpdate('CASCADE') // Updates repository if the organization ID is updated
      .notNullable()

    // Foreign key to 'projects' table
    table
      .integer('project_id')
      .unsigned()
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE') // Deletes repository if the organization is deleted
      .onUpdate('CASCADE') // Updates repository if the organization ID is updated
      .notNullable()

    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })

  // Add trigger to automatically update the 'updated_at' column
  await knex.raw(`
      CREATE TRIGGER set_updated_at_compliance_checks_tasks
      BEFORE UPDATE ON compliance_checks_tasks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `)
}

exports.down = async (knex) => {
  // Drop trigger
  await knex.raw('DROP TRIGGER IF EXISTS set_updated_at_compliance_checks_tasks ON compliance_checks_tasks;')
  // Drop table
  await knex.schema.dropTableIfExists('compliance_checks_tasks')
}
