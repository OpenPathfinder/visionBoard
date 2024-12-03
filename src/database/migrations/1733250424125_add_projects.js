exports.up = async (knex) => {
  // Create reusable trigger function for updated_at
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)

  // Create 'projects' table
  await knex.schema.createTable('projects', (table) => {
    table.increments('id').primary() // Primary key
    table.string('name').notNullable()
    table.enu('category', ['impact', 'at-large', 'incubation', 'emeritus']).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })

  // Add trigger to 'projects' table
  await knex.raw(`
    CREATE TRIGGER set_updated_at_projects
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `)
}

exports.down = async (knex) => {
  // Drop triggers
  await knex.raw('DROP TRIGGER IF EXISTS set_updated_at_projects ON projects;')
  // Drop tables
  await knex.schema.dropTableIfExists('projects')
  // Drop the reusable function
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;')
}
