const { Octokit } = require('octokit')
const { logger, ensureGithubToken } = require('../utils')
const { simplifyObject } = require('@ulisesgascon/simplify-object')
const util = require('util')
const exec = util.promisify(require('node:child_process').exec)
const { ossfScorecardSettings } = require('../config').getConfig()

const debug = require('debug')('providers:github')

const fetchOrgByLogin = async (login) => {
  if (!login) {
    throw new Error('Organization name is required')
  }

  debug(`Fetching organization (${login})...`)
  ensureGithubToken()
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

  const { data } = await octokit.request('GET /orgs/{org}', {
    org: login
  })

  return data
}

const fetchOrgReposListByLogin = async (login) => {
  if (!login) {
    throw new Error('Organization name is required')
  }

  debug(`Fetching organization (${login}) repositories...`)
  ensureGithubToken()
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
  let repoList = []

  // IMPORTANT: Ignore private repositories as they might contain sensitive information
  const orgQuery = { org: login, type: 'public', per_page: 100 }

  const { data: repos } = await octokit.rest.repos.listForOrg(orgQuery)

  debug(`Got ${repos.length} repos for org: ${login}`)
  repoList = repoList.concat(repos)

  // IMPORTANT: If the org has 100 repos it might require pagination management
  if (repoList.length === 100) {
    let page = 2
    let hasMore = true
    while (hasMore) {
      debug(`Getting page ${page} for org: ${login}`)
      const { data: repos, headers } = await octokit.rest.repos.listForOrg({ ...orgQuery, page })
      debug(`Got ${repos.length} repos for org: ${login}`)
      repoList = repoList.concat(repos)
      hasMore = headers.link.includes('rel="next"')
      page += 1
    }
  }

  return repoList
}

const fetchRepoByFullName = async (fullName) => {
  if (!fullName) {
    throw new Error('The full name is required')
  }

  const splitName = fullName.split('/')

  console.log(splitName)

  if (splitName.length !== 2 || (!splitName[0] || !splitName[1])) {
    throw new Error('The full name of the repository is invalid')
  }

  debug(`Fetching repository (${fullName})...`)
  ensureGithubToken()

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
  const { data } = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: splitName[0],
    repo: splitName[1]
  })
  return data
}

const performScorecardAnalysis = async (repo) => {
  ensureGithubToken()
  logger.info(`Running OSSF Scorecard for repository (${repo.full_name})...`)

  const start = new Date().getTime()
  const { stdout, stderr } = await exec(`docker run -e GITHUB_AUTH_TOKEN=${process.env.GITHUB_TOKEN} --rm ${ossfScorecardSettings.dockerImage} --repo=${repo.html_url} --show-details --format=json`)
  if (stderr) {
    throw new Error(`Error running analysis with OSSF Scorecard for repository (${repo.full_name}): ${stderr}`)
  }
  const data = JSON.parse(stdout)
  const end = new Date().getTime()
  data.analysis_execution_time = (end - start)
  logger.info(`OSSF Scorecard finished successfully for repository (${repo.full_name}) in ${data.analysis_execution_time / 1000}s`)
  return data
}

const github = {
  fetchOrgByLogin,
  fetchOrgReposListByLogin,
  fetchRepoByFullName,
  mappers: {
    org: (data) => {
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
    },
    repo: (data) => {
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
  }
}

const ossf = {
  performScorecardAnalysis,
  mappers: {
    result: (data) => {
      const output = {}
      output.analysis_score = data.score
      output.analysis_time = data.date
      output.repo_commit = data.repo?.commit
      output.scorecard_version = data.scorecard?.version
      output.scorecard_commit = data.scorecard?.commit
      data.checks?.forEach((check, i) => {
        const checkName = check.name.toLowerCase().replaceAll('-', '_')
        output[`${checkName}_reason`] = check.reason
        output[`${checkName}_score`] = check.score
        output[`${checkName}_documentation_url`] = check.documentation?.url
        output[`${checkName}_documentation`] = check.documentation?.short
        output[`${checkName}_details`] = check.details?.join('\n')
      })
      output.analysis_execution_time = data.analysis_execution_time
      return output
    }
  }
}

module.exports = {
  github,
  ossf
}
