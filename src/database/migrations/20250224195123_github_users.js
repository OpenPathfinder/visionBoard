/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
exports.up = async (knex) => {
  await knex.schema.createTable('github_users', (table) => {
    table.increments('id').primary() // Primary key
    table.string('name')
    table.string('email')
    table.string('login').notNullable()
    table.integer('github_user_id').unique().notNullable()
    table.string('node_id').notNullable()
    table.string('avatar_url')
    table.string('gravatar_id')
    table.string('url')
    table.string('html_url')
    table.string('gists_url')
    table.string('followers_url')
    table.string('following_url')
    table.string('starred_url')
    table.string('subscriptions_url')
    table.string('organizations_url')
    table.string('repos_url')
    table.string('events_url')
    table.string('received_events_url')
    table.string('type')
    table.boolean('site_admin').notNullable()
    table.string('starred_at')
    table.string('user_view_type')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })

  // Add trigger to 'github_organizations' table
  await knex.raw(`
    CREATE TRIGGER set_updated_at_github_users
    BEFORE UPDATE ON github_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `)
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  // Drop triggers
  await knex.raw('DROP TRIGGER IF EXISTS set_updated_at_github_users ON github_users;')
  // Drop table
  await knex.schema.dropTableIfExists('github_users')
}
