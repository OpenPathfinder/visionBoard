const githubOrgMFA = require('./githubOrgMFA')
const softwareDesignTraining = require('./softwareDesignTraining')
const adminRepoCreationOnly = require('./adminRepoCreationOnly')

const validators = {
  githubOrgMFA,
  softwareDesignTraining,
  adminRepoCreationOnly
}

module.exports = validators
