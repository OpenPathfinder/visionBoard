const resetDatabase = async (knex) => {
  await knex.raw('TRUNCATE TABLE github_organizations RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE projects RESTART IDENTITY CASCADE')
}

const getAllProjects = (knex) => knex('projects').select('*')
const getAllGithubOrgs = (knex) => knex('github_organizations').select('*')

const addProject = async (knex, { name, category }) => {
  const [project] = await knex('projects').insert({ name, category }).returning('*')
  return project
}

const addGithubOrg = async (knex, data) => {
  const [githubOrg] = await knex('github_organizations').insert(data).returning('*')
  return githubOrg
}

module.exports = {
  resetDatabase,
  getAllProjects,
  getAllGithubOrgs,
  addProject,
  addGithubOrg
}
