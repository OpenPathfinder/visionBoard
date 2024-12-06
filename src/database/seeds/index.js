const {
  sampleGithubOrg,
  sampleGithubRepository
} = require('../../../__fixtures__')
const {
  resetDatabase,
  addProject,
  addGithubOrg,
  addGithubRepo
} = require('../../../__utils__')
const { github } = require('../../providers')

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
  await addGithubRepo(knex, { ...github.mappers.repo(sampleGithubRepository), github_organization_id: githubOrg.id })
}
