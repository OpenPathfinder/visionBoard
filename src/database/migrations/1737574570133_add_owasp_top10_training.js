exports.up = async (knex) => {
  await knex.schema.createTable('owasp_top10_training', (table) => {
    table.increments('id').primary() // Primary key
    table.text('description').notNullable()
    table.enum('implementation_status', ['unknown', 'pending', 'completed']).notNullable().defaultTo('pending')
    table.string('training_date').defaultTo(knex.fn.now()).notNullable()
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()

    // Foreign key to 'projects' table
    table.integer('project_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE') // Deletes organization if the project is deleted
      .onUpdate('CASCADE') // Updates organization if the project ID is updated
  })

  // Add trigger to automatically update the 'updated_at' column
  await knex.raw(`
    CREATE TRIGGER set_updated_at_owasp_top10_training
    BEFORE UPDATE ON owasp_top10_training
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `)
}

exports.down = async (knex) => {
  // Drop trigger
  await knex.raw('DROP TRIGGER IF EXISTS set_updated_at_owasp_top10_training ON owasp_top10_training;')
  // Drop table
  await knex.schema.dropTableIfExists('owasp_top10_training')
}
