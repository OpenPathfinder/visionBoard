const githubOrgMFA = require('./githubOrgMFA')
const softwareDesignTraining = require('./softwareDesignTraining')
const owaspTop10Training = require('./owaspTop10Training')
const adminRepoCreationOnly = require('./adminRepoCreationOnly')
const noSensitiveInfoInRepositories = require('./noSensitiveInfoInRepositories')

const validators = {
  githubOrgMFA,
  softwareDesignTraining,
  owaspTop10Training,
  adminRepoCreationOnly,
  noSensitiveInfoInRepositories
}

module.exports = validators
