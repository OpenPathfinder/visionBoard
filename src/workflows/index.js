const debug = require('debug')('workflows')
const { github, ossf } = require('../providers')
const { initializeStore } = require('../store')
const { logger } = require('../utils')
const { validateGithubOrg, validateGithubListOrgRepos, validateGithubRepository, validateOSSFResult, validateGithubListOrgMembers } = require('../schemas')
const checks = require('../checks')
const { chunkArray } = require('@ulisesgascon/array-to-chunks')
const { ossfScorecardSettings } = require('../config').getConfig()

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
  logger.info('GitHub organizations updated successfully')
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
    logger.info(`Fetching repositories for org (${org.login})`)
    const repoList = await github.fetchOrgReposListByLogin(org.login)
    debug(`Got ${repoList.length} repositories for org (${org.login})`)
    debug('Validating data')
    validateGithubListOrgRepos(repoList)
    debug(`Enriching all repositories for org (${org.login})`)
    logger.info(`Enriching all repositories for org (${org.login})`)

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
  logger.info('GitHub repositories updated successfully')
}

const upsertGithubOrganizationMembers = async (knex) => {
  const { getAllGithubOrganizations, upsertGithubMembers, upsertGithubOrganizationMembers } = initializeStore(knex)
  const organizations = await getAllGithubOrganizations()
  debug('Checking stored organizations')
  if (organizations.length === 0) {
    throw new Error('No organizations found. Please add organizations/projects before running this workflow.')
  }

  debug('Fetching members for each organization from GitHub API')
  for await (const org of organizations) {
    debug(`Fetching members for org (${org.login})`)
    logger.info(`Fetching members for org (${org.login})`)
    const members = await github.fetchOrgMembersByLogin(org.login)
    debug(`Got ${members.length} members for org: ${org.login}`)
    debug('Validating data')
    validateGithubListOrgMembers(members)
    debug(`Enriching all organization members for org (${org.login})`)
    logger.info(`Enriching all organization members for org (${org.login})`)

    // Upsert each member in parallel
    for await (const member of members) {
      debug(`Upserting member (${member.login})`)
      const mappedData = github.mappers.user(member)
      debug(`Transforming member (${member.login}) data`)
      const memberDatabase = await upsertGithubMembers(mappedData)

      for (const memberData of memberDatabase) {
        debug(`Upserting member (${member.login}) in organization (${org.login})`)

        await upsertGithubOrganizationMembers({
          github_user_id: memberData.id,
          github_organization_id: org.id
        })
      }
    }
  }
  logger.info('GitHub organization members updated successfully')
}

const runAllTheComplianceChecks = async (knex) => {
  const { getAllComplianceChecks } = initializeStore(knex)
  debug('Fetching all compliance checks')
  const complianceChecks = await getAllComplianceChecks()
  const implementedChecks = complianceChecks.filter(check => check.implementation_status === 'completed')
  logger.info('Running all implemented checks sequentially')
  for (const check of implementedChecks) {
    logger.info(`Running check (${check.code_name})`)
    await checks[check.code_name](knex)
  }
  logger.info('All checks ran successfully')
}

const upsertOSSFScorecardAnalysis = async (knex) => {
  const { getAllGithubRepositories, upsertOSSFScorecard } = initializeStore(knex)
  const repositories = await getAllGithubRepositories()
  debug('Checking stored repositories')
  if (repositories.length === 0) {
    throw new Error('No repositories found. Please add repositories before running this workflow.')
  }
  logger.info('Running OSSF Scorecard for all repositories')
  logger.info('This may take a while...')
  const chunks = chunkArray(repositories, ossfScorecardSettings.parallelJobs)
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    logger.info(`Processing chunk ${i + 1} of ${chunks.length} including ${chunk.length} repositories`)
    await Promise.all(chunk.map(async (repo) => {
      debug(`Running OSSF Scorecard for repository (${repo.full_name})`)
      try {
        const scorecard = await ossf.performScorecardAnalysis(repo)
        debug(`Validating OSSF Scorecard result for repository (${repo.full_name})`)
        validateOSSFResult(scorecard)
        debug(`Transforming OSSF Scorecard result for repository (${repo.full_name})`)
        const mappedData = ossf.mappers.result(scorecard)
        debug(`Upserting OSSF Scorecard result for repository (${repo.full_name})`)
        await upsertOSSFScorecard({ ...mappedData, github_repository_id: repo.id })
      } catch (error) {
        logger.warn(`Error running OSSF Scorecard for repository (${repo.full_name}). Skipping...`)
        logger.warn(error.message)
      }
    }))
  }

  logger.info('The OSSF Scorecard ran successfully')
}

module.exports = {
  updateGithubOrgs,
  upsertGithubRepositories,
  upsertGithubOrganizationMembers,
  runAllTheComplianceChecks,
  upsertOSSFScorecardAnalysis
}
