const debug = require('debug')('workflows')
const { simplifyObject } = require('@ulisesgascon/simplify-object')
const { github } = require('../providers')
const { initializeStore } = require('../store')
const { logger } = require('../utils')
const { validateGithubOrg, validateGithubListOrgRepos, validateGithubRepository } = require('../schemas')

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

const mapRepoData = (data) => {
  const mappedData = simplifyObject(data, {
    include: [
      'node_id', 'name', 'full_name',
      'html_url', 'description', 'fork', 'url',
      'git_url', 'ssh_url', 'clone_url', 'svn_url',
      'homepage', 'size', 'stargazers_count', 'watchers_count',
      'language', 'has_issues', 'has_projects', 'has_downloads',
      'has_wiki', 'has_pages', 'has_discussions', 'forks_count',
      'mirror_url', 'archived', 'disabled', 'open_issues_count',
      'allow_forking', 'is_template', 'web_commit_signoff_required',
      'topics', 'visibility', 'default_branch', 'allow_squash_merge',
      'allow_merge_commit', 'allow_rebase_merge', 'allow_auto_merge',
      'delete_branch_on_merge', 'allow_update_branch', 'use_squash_pr_title_as_default',
      'squash_merge_commit_message', 'squash_merge_commit_title', 'merge_commit_message',
      'merge_commit_title', 'network_count', 'subscribers_count'
    ]
  })
  // Additional fields that have different names in the database
  mappedData.github_repo_id = data.id
  mappedData.github_created_at = data.created_at
  mappedData.github_updated_at = data.updated_at
  mappedData.github_archived_at = data.archived_at
  // license
  mappedData.license_key = data.license?.key
  mappedData.license_name = data.license?.name
  mappedData.license_spdx_id = data.license?.spdx_id
  mappedData.license_url = data.license?.url
  mappedData.license_node_id = data.license?.node_id
  // Security and analysis
  mappedData.secret_scanning_status = data.security_and_analysis?.secret_scanning?.status
  mappedData.secret_scanning_push_protection_status = data.security_and_analysis?.secret_scanning_push_protection?.status
  mappedData.dependabot_security_updates_status = data.security_and_analysis?.dependabot_security_updates?.status
  mappedData.secret_scanning_non_provider_patterns_status = data.security_and_analysis?.secret_scanning_non_provider_patterns?.status
  mappedData.secret_scanning_validity_checks_status = data.security_and_analysis?.secret_scanning_validity_checks?.status
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
    debug('Validating data')
    validateGithubOrg(data)
    debug('Transforming data')
    const mappedData = mapOrgData(data)
    debug('Updating organization in database')
    await updateGithubOrganization(mappedData)
  }))
  logger.log('GitHub organizations updated successfully')
}

const upsertGithubRepositories = async (knex) => {
  const { getAllGithubOrganizations, upsertGithubRepository } = initializeStore(knex)
  const organizations = await getAllGithubOrganizations()
  debug('Checking stored organizations')
  if (organizations.length === 0) {
    throw new Error('No organizations found. Please add organizations/projects before running this workflow.')
  }

  debug('Fetching repositories for organizations from GitHub API')

  await Promise.all(organizations.map(async (org) => {
    debug(`Fetching repositories for org (${org.login})`)
    const repoList = await github.fetchOrgReposListByLogin(org.login)
    debug(`Got ${repoList.length} repositories for org (${org.login})`)
    debug('Validating data')
    validateGithubListOrgRepos(repoList)
    debug(`Enriching all repositories for org (${org.login})`)

    // Enrich and upsert each repository in parallel
    await Promise.all(repoList.map(async (repo) => {
      debug(`Enriching repository (${repo.full_name})`)
      const repoData = await github.fetchRepoByFullName(repo.full_name)
      debug(`Validating repository (${repo.full_name})`)
      validateGithubRepository(repoData)
      debug(`Transforming repository (${repo.full_name}) data`)
      const mappedData = mapRepoData(repoData)
      debug(`Upserting repository (${repo.full_name})`)
      await upsertGithubRepository(mappedData, org.id)
    }))
  }))
}

module.exports = {
  updateGithubOrgs,
  upsertGithubRepositories
}
