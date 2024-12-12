exports.up = async (knex) => {
  await knex.schema.createTable('ossf_scorecard_results', (table) => {
    table.increments('id').primary() // Primary key
    table.float('analysis_score').notNullable()
    table.timestamp('analysis_time').notNullable()
    table.string('analysis_execution_time').notNullable()
    table.string('repo_commit').notNullable()
    table.string('scorecard_version').notNullable()
    table.string('scorecard_commit').notNullable()
    // binary_artifacts
    table.string('binary_artifacts_reason')
    table.float('binary_artifacts_score')
    table.string('binary_artifacts_documentation_url')
    table.string('binary_artifacts_documentation')
    table.text('binary_artifacts_details')
    // branch_protection
    table.string('branch_protection_reason')
    table.float('branch_protection_score')
    table.string('branch_protection_documentation_url')
    table.string('branch_protection_documentation')
    table.text('branch_protection_details')
    // ci_tests
    table.string('ci_tests_reason')
    table.float('ci_tests_score')
    table.string('ci_tests_documentation_url')
    table.string('ci_tests_documentation')
    table.text('ci_tests_details')
    // cii_best_practices
    table.string('cii_best_practices_reason')
    table.float('cii_best_practices_score')
    table.string('cii_best_practices_documentation_url')
    table.string('cii_best_practices_documentation')
    table.text('cii_best_practices_details')
    // code_review
    table.string('code_review_reason')
    table.float('code_review_score')
    table.string('code_review_documentation_url')
    table.string('code_review_documentation')
    table.text('code_review_details')
    // contributors
    table.string('contributors_reason')
    table.float('contributors_score')
    table.string('contributors_documentation_url')
    table.string('contributors_documentation')
    table.text('contributors_details')
    // dangerous_workflow
    table.string('dangerous_workflow_reason')
    table.float('dangerous_workflow_score')
    table.string('dangerous_workflow_documentation_url')
    table.string('dangerous_workflow_documentation')
    table.text('dangerous_workflow_details')
    // dependency_update_tool
    table.string('dependency_update_tool_reason')
    table.float('dependency_update_tool_score')
    table.string('dependency_update_tool_documentation_url')
    table.string('dependency_update_tool_documentation')
    table.text('dependency_update_tool_details')
    // fuzzing
    table.string('fuzzing_reason')
    table.float('fuzzing_score')
    table.string('fuzzing_documentation_url')
    table.string('fuzzing_documentation')
    table.text('fuzzing_details')
    // license
    table.string('license_reason')
    table.float('license_score')
    table.string('license_documentation_url')
    table.string('license_documentation')
    table.text('license_details')
    // maintained
    table.string('maintained_reason')
    table.float('maintained_score')
    table.string('maintained_documentation_url')
    table.string('maintained_documentation')
    table.text('maintained_details')
    // packaging
    table.string('packaging_reason')
    table.float('packaging_score')
    table.string('packaging_documentation_url')
    table.string('packaging_documentation')
    table.text('packaging_details')
    // pinned_dependencies
    table.string('pinned_dependencies_reason')
    table.float('pinned_dependencies_score')
    table.string('pinned_dependencies_documentation_url')
    table.string('pinned_dependencies_documentation')
    table.text('pinned_dependencies_details')
    // sast
    table.string('sast_reason')
    table.float('sast_score')
    table.string('sast_documentation_url')
    table.string('sast_documentation')
    table.text('sast_details')
    // security_policy
    table.string('security_policy_reason')
    table.float('security_policy_score')
    table.string('security_policy_documentation_url')
    table.string('security_policy_documentation')
    table.text('security_policy_details')
    // signed_releases
    table.string('signed_releases_reason')
    table.float('signed_releases_score')
    table.string('signed_releases_documentation_url')
    table.string('signed_releases_documentation')
    table.text('signed_releases_details')
    // token_permissions
    table.string('token_permissions_reason')
    table.float('token_permissions_score')
    table.string('token_permissions_documentation_url')
    table.string('token_permissions_documentation')
    table.text('token_permissions_details')
    // vulnerabilities
    table.string('vulnerabilities_reason')
    table.float('vulnerabilities_score')
    table.string('vulnerabilities_documentation_url')
    table.string('vulnerabilities_documentation')
    table.text('vulnerabilities_details')

    // Foreign key to 'projects' table
    table
      .integer('github_repository_id')
      .unsigned()
      .references('id')
      .inTable('github_repositories')
      .onDelete('CASCADE') // Deletes repository if the organization is deleted
      .onUpdate('CASCADE') // Updates repository if the organization ID is updated
      .notNullable()

    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })

  // Add trigger to automatically update the 'updated_at' column
  await knex.raw(`
      CREATE TRIGGER set_updated_at_ossf_scorecard_results
      BEFORE UPDATE ON ossf_scorecard_results
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `)
}

exports.down = async (knex) => {
  // Drop trigger
  await knex.raw('DROP TRIGGER IF EXISTS set_updated_at_ossf_scorecard_results ON ossf_scorecard_results;')
  // Drop table
  await knex.schema.dropTableIfExists('ossf_scorecard_results')
}
