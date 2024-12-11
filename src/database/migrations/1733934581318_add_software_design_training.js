exports.up = async (knex) => {
  await knex.schema.createTable('software_design_training', (table) => {
    table.increments('id').primary() // Primary key
    table.text('description').notNullable()
    table.enum('implementation_status', ['unknown', 'pending', 'completed']).notNullable().defaultTo('pending')
    table.timestamp('training_date').defaultTo(knex.fn.now()).notNullable()
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
      CREATE TRIGGER set_updated_at_software_design_training
      BEFORE UPDATE ON software_design_training
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `)
}

exports.down = async (knex) => {
  // Drop trigger
  await knex.raw('DROP TRIGGER IF EXISTS set_updated_at_software_design_training ON software_design_training;')
  // Drop table
  await knex.schema.dropTableIfExists('software_design_training')
}
