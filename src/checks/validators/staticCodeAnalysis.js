const debug = require('debug')('checks:validator:adminRepoCreationOnly')

// @see: https://github.com/OpenPathfinder/visionBoard/issues/75
module.exports = ({ data = [], check, projects = [] }) => {
  debug('Validating that the repositories have static code analysis...')

  const alerts = []
  const results = []
  const tasks = []

  return {
    alerts,
    results,
    tasks
  }
}
