const debug = require('debug')('workflows')
const { github } = require('../providers')
const { initializeStore } = require('../store')
const { logger } = require('../utils')
const { validateGithubOrg, validateGithubListOrgRepos, validateGithubRepository } = require('../schemas')

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
    const mappedData = github.mappers.org(data)
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
      const mappedData = github.mappers.repo(repoData)
      debug(`Upserting repository (${repo.full_name})`)
      await upsertGithubRepository(mappedData, org.id)
    }))
  }))
}

module.exports = {
  updateGithubOrgs,
  upsertGithubRepositories
}
