const resetDatabase = async (knex) => {
  await knex('github_organizations').del()
  await knex('projects').del()
}

const getAllProjects = (knex) => knex('projects').select('*')
const getAllGithubOrgs = (knex) => knex('github_organizations').select('*')

module.exports = {
  resetDatabase,
  getAllProjects,
  getAllGithubOrgs
}
