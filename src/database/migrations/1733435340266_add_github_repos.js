exports.up = async (knex) => {
  // Create 'github_repositories' table
  await knex.schema.createTable('github_repositories', (table) => {
    table.increments('id').primary() // Primary key
    table.string('node_id').unique().notNullable()
    table.string('name').notNullable()
    table.string('full_name').notNullable()
    table.string('html_url').notNullable()
    table.text('description')
    table.boolean('fork')
    table.string('url').notNullable()
    table.string('git_url').notNullable()
    table.string('ssh_url').notNullable()
    table.string('clone_url').notNullable()
    table.string('svn_url')
    table.string('homepage')
    table.integer('size')
    table.integer('stargazers_count')
    table.integer('watchers_count')
    table.string('language')
    table.boolean('has_issues')
    table.boolean('has_projects')
    table.boolean('has_downloads')
    table.boolean('has_wiki')
    table.boolean('has_pages')
    table.boolean('has_discussions')
    table.integer('forks_count')
    table.string('mirror_url')
    table.boolean('archived')
    table.boolean('disabled')
    table.integer('open_issues_count')
    table.boolean('allow_forking')
    table.boolean('is_template')
    table.boolean('web_commit_signoff_required')
    table.specificType('topics', 'text[]') // Array of strings
    table.enu('visibility', ['public', 'private', 'internal']).notNullable()
    table.string('default_branch').notNullable()
    table.boolean('allow_squash_merge')
    table.boolean('allow_merge_commit')
    table.boolean('allow_rebase_merge')
    table.boolean('allow_auto_merge')
    table.boolean('delete_branch_on_merge')
    table.boolean('allow_update_branch')
    table.boolean('use_squash_pr_title_as_default')
    table.string('squash_merge_commit_message')
    table.string('squash_merge_commit_title')
    table.string('merge_commit_message')
    table.string('merge_commit_title')
    table.integer('network_count')
    table.integer('subscribers_count')
    table.integer('github_repo_id').unique()
    table.timestamp('github_created_at')
    table.timestamp('github_updated_at')
    table.timestamp('github_archived_at')
    table.string('license_key')
    table.string('license_name')
    table.string('license_spdx_id')
    table.string('license_url')
    table.string('license_node_id')
    table.enu('secret_scanning_status', ['enabled', 'disabled']).defaultTo('disabled')
    table.enu('secret_scanning_push_protection_status', ['enabled', 'disabled']).defaultTo('disabled')
    table.enu('dependabot_security_updates_status', ['enabled', 'disabled']).defaultTo('disabled')
    table.enu('secret_scanning_non_provider_patterns_status', ['enabled', 'disabled']).defaultTo('disabled')
    table.enu('secret_scanning_validity_checks_status', ['enabled', 'disabled']).defaultTo('disabled')

    // Foreign key to 'github_organizations' table
    table.integer('github_organization_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('github_organizations')
      .onDelete('CASCADE') // Deletes repository if the organization is deleted
      .onUpdate('CASCADE') // Updates repository if the organization ID is updated

    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })

  // Add trigger to 'github_repositories' table
  await knex.raw(`
      CREATE TRIGGER set_updated_at_github_repositories
      BEFORE UPDATE ON github_repositories
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `)
}

exports.down = async (knex) => {
  // Drop trigger
  await knex.raw('DROP TRIGGER IF EXISTS set_updated_at_github_repositories ON github_repositories;')
  // Drop table
  await knex.schema.dropTableIfExists('github_repositories')
}
