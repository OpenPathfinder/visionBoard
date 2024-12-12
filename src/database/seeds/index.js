const {
  sampleGithubOrg,
  sampleGithubRepository,
  sampleOSSFScorecardResult
} = require('../../../__fixtures__')
const {
  resetDatabase,
  addProject,
  addGithubOrg,
  addGithubRepo,
  addOSSFScorecardResult
} = require('../../../__utils__')
const { github, ossf } = require('../../providers')

exports.seed = async (knex) => {
  // Clean up the database
  await resetDatabase(knex)

  // Add a project
  const project = await addProject(knex, {
    name: 'github',
    category: 'impact'
  })

  // Add a GitHub organization
  const githubOrg = await addGithubOrg(knex, { ...github.mappers.org(sampleGithubOrg), project_id: project.id })

  // Add GitHub repository
  const githubRepo = await addGithubRepo(knex, { ...github.mappers.repo(sampleGithubRepository), github_organization_id: githubOrg.id })

  // Add OSSF Scorecard results
  await addOSSFScorecardResult(knex, { ...ossf.mappers.result(sampleOSSFScorecardResult), github_repository_id: githubRepo.id, analysis_execution_time: 19123 })
}
