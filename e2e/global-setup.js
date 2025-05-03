// @ts-check
const knexInit = require('knex')
const { getConfig } = require('../src/config')
const { resetDatabase, initializeStore } = require('../__utils__')
const { sampleGithubOrg, sampleGithubRepository } = require('../__fixtures__')

const { dbSettings } = getConfig('test')

/**
 * Global setup for Playwright tests
 * This is run once before all tests
 * It sets up the database with test fixtures
 */
async function globalSetup () {
  console.log('Setting up E2E test fixtures...')

  // Initialize database connection
  const knex = knexInit(dbSettings)

  try {
    // Get store functions
    const { addProject, addGithubOrganization, upsertGithubRepository } = initializeStore(knex)

    // Reset database for a clean slate
    await resetDatabase(knex)

    // Add a test project
    const testProject = await addProject({
      name: 'E2E Test Project'
    })

    // Add a GitHub organization for the test project
    const testOrg = await addGithubOrganization({
      login: sampleGithubOrg.login,
      html_url: sampleGithubOrg.html_url,
      project_id: testProject.id,
      node_id: sampleGithubOrg.node_id
    })

    // Add a GitHub repository for the test organization
    await upsertGithubRepository({
      name: sampleGithubRepository.name,
      full_name: sampleGithubRepository.full_name,
      html_url: sampleGithubRepository.html_url,
      url: sampleGithubRepository.url,
      node_id: sampleGithubRepository.node_id,
      stargazers_count: sampleGithubRepository.stargazers_count || 10,
      forks_count: sampleGithubRepository.forks_count || 5,
      subscribers_count: sampleGithubRepository.subscribers_count || 3,
      open_issues_count: sampleGithubRepository.open_issues_count || 2,
      git_url: sampleGithubRepository.git_url,
      ssh_url: sampleGithubRepository.ssh_url,
      clone_url: sampleGithubRepository.clone_url,
      visibility: sampleGithubRepository.visibility,
      default_branch: sampleGithubRepository.default_branch
    }, testOrg.id)

    console.log('E2E test fixtures created successfully')
  } catch (error) {
    console.error('Error setting up E2E test fixtures:', error)
    throw error
  } finally {
    // Close database connection
    await knex.destroy()
  }
}

module.exports = globalSetup
