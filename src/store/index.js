const debug = require('debug')('store')

const addGithubOrganization = knex => async (organization) => {
  const organizationExists = await knex('github_organizations').where({ html_url: organization.html_url }).first()
  debug(`Checking if organization (${organization.login}) exists...`)
  if (organizationExists) {
    throw new Error(`Organization with login (${organization.login}) already exists`)
  }
  debug(`Inserting organization (${organization.login})...`)
  return knex('github_organizations').insert({
    html_url: organization.html_url,
    login: organization.login
  })
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
  })
}

const initializeStore = (knex) => {
  debug('Initializing store...')
  return {
    addProject: addProject(knex),
    addGithubOrganization: addGithubOrganization(knex)
  }
}

module.exports = {
  initializeStore
}
