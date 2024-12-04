const debug = require('debug')('workflows')
const { simplifyObject } = require('@ulisesgascon/simplify-object')
const { github } = require('../providers')
const { initializeStore } = require('../store')

const mapOrgData = (data) => {
  const mappedData = simplifyObject(data, {
    // Relevant fields for organizations
    include: [
      'login', 'node_id', 'url', 'avatar_url',
      'description', 'name', 'company', 'blog',
      'location', 'twitter_username', 'is_verified',
      'has_organization_projects', 'has_repository_projects',
      'public_repos', 'public_gists', 'followers',
      'following', 'html_url', 'total_private_repos',
      'owned_private_repos', 'private_gists', 'disk_usage',
      'collaborators', 'default_repository_permission',
      'default_repository_permission', 'members_can_create_repositories',
      'two_factor_requirement_enabled', 'members_allowed_repository_creation_type',
      'members_can_create_public_repositories', 'members_can_create_private_repositories',
      'members_can_create_internal_repositories', 'members_can_create_pages',
      'members_can_create_public_pages', 'members_can_create_private_pages',
      'members_can_fork_private_repositories', 'web_commit_signoff_required',
      'deploy_keys_enabled_for_repositories', 'dependency_graph_enabled_for_new_repositories',
      'dependabot_alerts_enabled_for_new_repositories', 'dependabot_security_updates_enabled_for_new_repositories',
      'advanced_security_enabled_for_new_repositories', 'secret_scanning_enabled_for_new_repositories',
      'secret_scanning_push_protection_enabled_for_new_repositories', 'secret_scanning_push_protection_custom_link',
      'secret_scanning_push_protection_custom_link_enabled']
  })
  // Additional fields that have different names in the database
  mappedData.github_org_id = data.id
  mappedData.github_created_at = data.created_at
  mappedData.github_updated_at = data.updated_at
  mappedData.github_archived_at = data.archived_at
  return mappedData
}

const updateGithubOrgs = async (knex) => {
  const { getAllGithubOrganizations, updateGithubOrganization } = initializeStore(knex)
  const organizations = await getAllGithubOrganizations()
  debug('Checking organizations details')
  if (organizations.length === 0) {
    throw new Error('No organizations found. Please add organizations/projects before running this workflow.')
  }
  debug('Fetching details for organizations from GitHub API')
  await Promise.all(organizations.map(async (org) => {
    debug(`Fetching details for org (${org.login})`)
    const data = await github.fetchOrgByLogin(org.login)
    debug('Transforming data')
    const mappedData = mapOrgData(data)
    debug('Updating organization in database')
    await updateGithubOrganization(mappedData)
  }))
  console.log('GitHub organizations updated successfully')
}

module.exports = {
  updateGithubOrgs
}
