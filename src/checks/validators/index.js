const githubOrgMFA = require('./githubOrgMFA')
const softwareDesignTraining = require('./softwareDesignTraining')
const owaspTraining = require('./owaspTraining')
const adminRepoCreationOnly = require('./adminRepoCreationOnly')

const validators = {
  githubOrgMFA,
  softwareDesignTraining,
  owaspTraining,
  adminRepoCreationOnly
}

module.exports = validators
