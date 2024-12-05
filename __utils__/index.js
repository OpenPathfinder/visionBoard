const resetDatabase = async (knex) => {
  await knex.raw('TRUNCATE TABLE github_repositories RESTART IDENTITY CASCADE')
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

const getAllGithubRepos = (knex) => knex('github_repositories').select('*')
const addGithubRepo = async (knex, data) => {
  const [githubRepo] = await knex('github_repositories').insert(data).returning('*')
  return githubRepo
}

module.exports = {
  resetDatabase,
  getAllProjects,
  getAllGithubOrgs,
  addProject,
  addGithubOrg,
  getAllGithubRepos,
  addGithubRepo
}
