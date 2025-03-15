/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable('github_organization_members', (table) => {
    table.increments('id').primary() // Primary key
    // Foreign key to 'github_organizations' table
    table
      .integer('github_organization_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('github_organizations')
      .onDelete('CASCADE') // Deletes repository if the organization is deleted
      .onUpdate('CASCADE') // Updates repository if the organization ID is updated

    // Foreign key to 'github_organizations' table
    table
      .integer('github_user_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('github_users')
      .onDelete('CASCADE') // Deletes repository if the organization is deleted
      .onUpdate('CASCADE') // Updates repository if the organization ID is updated
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  // Drop table
  await knex.schema.dropTableIfExists('github_organization_members')
}
