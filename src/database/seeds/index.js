const {
  sampleGithubOrg,
  sampleGithubRepository,
  sampleOSSFScorecardResult
} = require('../../../__fixtures__')
const {
  resetDatabase,
  initializeStore
} = require('../../../__utils__')
const { github, ossf } = require('../../providers')

exports.seed = async (knex) => {
  // Clean up the database
  await resetDatabase(knex)
  const {
    addProject,
    addGithubOrganization: addGithubOrg,
    addGithubRepo,
    addOSSFScorecardResult
  } = initializeStore(knex)

  // Add a project
  const project = await addProject({
    name: 'github',
    category: 'impact'
  })

  // Add a GitHub organization
  const githubOrg = await addGithubOrg({ ...github.mappers.org(sampleGithubOrg), project_id: project.id })

  // Add GitHub repository
  const githubRepo = await addGithubRepo({ ...github.mappers.repo(sampleGithubRepository), github_organization_id: githubOrg.id })

  // Add OSSF Scorecard results
  await addOSSFScorecardResult({ ...ossf.mappers.result(sampleOSSFScorecardResult), github_repository_id: githubRepo.id, analysis_execution_time: 19123 })
}
