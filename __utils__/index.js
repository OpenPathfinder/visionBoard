const resetDatabase = async (knex) => {
  await knex.raw('TRUNCATE TABLE compliance_checks_results RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE compliance_checks_tasks RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE compliance_checks_alerts RESTART IDENTITY CASCADE')
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

const getAllResults = (knex) => knex('compliance_checks_results').select('*')
const getAllTasks = (knex) => knex('compliance_checks_tasks').select('*')
const getAllAlerts = (knex) => knex('compliance_checks_alerts').select('*')
const addAlert = async (knex, alert) => {
  const [newAlert] = await knex('compliance_checks_alerts').insert(alert).returning('*')
  return newAlert
}

const addTask = async (knex, task) => {
  const [newTask] = await knex('compliance_checks_tasks').insert(task).returning('*')
  return newTask
}

const addResult = async (knex, result) => {
  const [newResult] = await knex('compliance_checks_results').insert(result).returning('*')
  return newResult
}

const getAllComplianceChecks = (knex) => knex('compliance_checks').select('*')
const getCheckByCodeName = async (knex, codeName) => {
  const check = await knex('compliance_checks').where({ code_name: codeName }).first()
  return check
}

module.exports = {
  getAllComplianceChecks,
  resetDatabase,
  getAllProjects,
  getAllGithubOrgs,
  addProject,
  addGithubOrg,
  getAllGithubRepos,
  addGithubRepo,
  getAllResults,
  getAllTasks,
  getAllAlerts,
  addAlert,
  addTask,
  addResult,
  getCheckByCodeName
}
