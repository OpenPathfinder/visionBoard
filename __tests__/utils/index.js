const resetDatabase = (knex) => knex('projects').del()
const getAllProjects = (knex) => knex('projects').select('*')

module.exports = {
  resetDatabase,
  getAllProjects
}
