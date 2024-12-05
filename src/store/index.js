const debug = require('debug')('store')

const getAllGithubOrganizations = knex => async () => {
  debug('Getting all GitHub organizations...')
  return knex('github_organizations').select()
}

const updateGithubOrganization = knex => async (organization) => {
  const { login } = organization
  debug(`Updating organization (${login})...`)
  return knex('github_organizations').where({ login }).update(organization).returning('*')
}

const addGithubOrganization = knex => async (organization) => {
  const organizationExists = await knex('github_organizations').where({ html_url: organization.html_url }).first()
  debug(`Checking if organization (${organization.login}) exists...`)
  if (organizationExists) {
    throw new Error(`Organization with login (${organization.login}) already exists`)
  }
  debug(`Inserting organization (${organization.login})...`)
  return knex('github_organizations').insert(organization).returning('*')
}

const addProject = knex => async (project) => {
  const { name, category } = project
  const projectExists = await knex('projects').where({ name }).first()
  debug(`Checking if project (${name}) exists...`)
  if (projectExists) {
    throw new Error(`Project with name (${name}) already exists`)
  }
  debug(`Inserting project (${name})...`)
  return knex('projects').insert({
    name,
    category
  }).returning('*')
}

const initializeStore = (knex) => {
  debug('Initializing store...')
  return {
    addProject: addProject(knex),
    addGithubOrganization: addGithubOrganization(knex),
    getAllGithubOrganizations: getAllGithubOrganizations(knex),
    updateGithubOrganization: updateGithubOrganization(knex)
  }
}

module.exports = {
  initializeStore
}
