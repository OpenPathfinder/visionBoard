const githubOrgMFA = require('./githubOrgMFA')
const softwareDesignTraining = require('./softwareDesignTraining')
const owaspTop10Training = require('./owaspTop10Training')
const adminRepoCreationOnly = require('./adminRepoCreationOnly')

const validators = {
  githubOrgMFA,
  softwareDesignTraining,
  owaspTop10Training,
  adminRepoCreationOnly
}

module.exports = validators
