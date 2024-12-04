const debug = require('debug')('store')

const addProject = knex => async (project) => {
  const { name, category } = project
  const projectExists = await knex('projects').where({ name }).first()
  debug(`Checking if project ${name} exists...`)
  if (projectExists) {
    throw new Error(`Project with name ${name} already exists`)
  }
  debug(`Inserting project ${name}...`)
  return knex('projects').insert({
    name,
    category
  })
}

const initializeStore = (knex) => {
  debug('Initializing store...')
  return {
    addProject: addProject(knex)
  }
}

module.exports = {
  initializeStore
}
