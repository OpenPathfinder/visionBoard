exports.up = async (knex) => {
  // Create 'github_organizations' table
  await knex.schema.createTable('github_organizations', (table) => {
    table.increments('id').primary() // Primary key
    table.string('login').unique().notNullable()
    table.integer('github_org_id').unique()
    table.string('node_id')
    table.string('url')
    table.string('repos_url')
    table.string('avatar_url')
    table.text('description')
    table.string('name')
    table.string('company')
    table.string('blog')
    table.string('location')
    table.string('email')
    table.string('twitter_username')
    table.boolean('is_verified')
    table.boolean('has_organization_projects')
    table.boolean('has_repository_projects')
    table.integer('public_repos')
    table.integer('public_gists')
    table.integer('followers')
    table.integer('following')
    table.string('html_url').notNullable()
    table.integer('total_private_repos')
    table.integer('owned_private_repos')
    table.integer('private_gists')
    table.integer('disk_usage')
    table.integer('collaborators')
    table.string('default_repository_permission')
    table.boolean('members_can_create_repositories')
    table.boolean('two_factor_requirement_enabled')
    table.string('members_allowed_repository_creation_type')
    table.boolean('members_can_create_public_repositories')
    table.boolean('members_can_create_private_repositories')
    table.boolean('members_can_create_internal_repositories')
    table.boolean('members_can_create_pages')
    table.boolean('members_can_create_public_pages')
    table.boolean('members_can_create_private_pages')
    table.boolean('members_can_fork_private_repositories')
    table.boolean('web_commit_signoff_required')
    table.boolean('deploy_keys_enabled_for_repositories')
    table.boolean('dependency_graph_enabled_for_new_repositories')
    table.boolean('dependabot_alerts_enabled_for_new_repositories')
    table.boolean('dependabot_security_updates_enabled_for_new_repositories')
    table.boolean('advanced_security_enabled_for_new_repositories')
    table.boolean('secret_scanning_enabled_for_new_repositories')
    table.boolean('secret_scanning_push_protection_enabled_for_new_repositories')
    table.string('secret_scanning_push_protection_custom_link')
    table.boolean('secret_scanning_push_protection_custom_link_enabled')
    table.timestamp('github_created_at')
    table.timestamp('github_updated_at')
    table.timestamp('github_archived_at')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()

    // Foreign key to 'projects' table
    table.integer('project_id')
      .unsigned()
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE') // Deletes organization if the project is deleted
      .onUpdate('CASCADE') // Updates organization if the project ID is updated
  })

  // Add trigger to 'github_organizations' table
  await knex.raw(`
      CREATE TRIGGER set_updated_at_github_organizations
      BEFORE UPDATE ON github_organizations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `)
}

exports.down = async (knex) => {
  // Drop triggers
  await knex.raw('DROP TRIGGER IF EXISTS set_updated_at_github_organizations ON github_organizations;')
  // Drop table
  await knex.schema.dropTableIfExists('github_organizations')
  // Drop the reusable function
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;')
}
