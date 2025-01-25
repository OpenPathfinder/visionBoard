const debug = require('debug')('checks:validator:noSensitiveInfoInRepositories')
const { getSeverityFromPriorityGroup, groupArrayItemsByCriteria, generatePercentage } = require('../../utils')

const groupByOrganization = groupArrayItemsByCriteria('project_id')

// @see: https://github.com/OpenPathfinder/visionBoard/issues/67
module.exports = ({ repositories = [], check, projects = [] }) => {
  debug('Validating that secret scanning is enabled...')
  debug('Grouping repositories by project...')
  const repositoriesGroupedByProject = groupByOrganization(repositories)

  const alerts = []
  const results = []
  const tasks = []

  debug('Processing repositories...')
  repositoriesGroupedByProject.forEach((projectOrgs) => {
    debug(`Processing Project (${projectOrgs[0].github_organization_id})`)
    const project = projects.find(p => p.id === projectOrgs[0].project_id)
    const baseData = {
      project_id: project.id, // dynamic
      compliance_check_id: check.id,
      severity: getSeverityFromPriorityGroup(check.default_priority_group)
    }

    const result = { ...baseData }
    const task = { ...baseData }
    const alert = { ...baseData }

    let orgMessage = ''
    let repoMessage = ''

    const failedOrgs = new Set(projectOrgs.filter(org => org.secret_scanning_enabled_for_new_repositories === false).map(org => org.login))
    const unknownOrgs = new Set(projectOrgs.filter(org => org.secret_scanning_enabled_for_new_repositories === null).map(org => org.login))
    const failedRepos = projectOrgs.filter(org => org.secret_scanning_status === 'disabled').map(org => org.login)
    const unknownRepos = projectOrgs.filter(org => org.secret_scanning_status === null).map(org => org.login)

    if (projectOrgs.every(repo => repo.secret_scanning_status === 'enabled') && projectOrgs.every(repo => repo.secret_scanning_enabled_for_new_repositories === true)) {
      result.status = 'passed'
      result.rationale = 'The organizations(s) and repositories has secret scanning enabled'
    } else if (failedOrgs.size || failedRepos.length) {
      const percentageOfFailedRepos = generatePercentage(projectOrgs.length, failedRepos.length)
      orgMessage = failedOrgs.size ? `The organization(s) (${[...failedOrgs].join(',')}) has not enabled secret scanning by default` : 'The organization(s) has secret scanning for new repositories enabled'
      repoMessage = failedRepos.length ? `${failedRepos.length} (${percentageOfFailedRepos}) repositories do not have the secret scanner enabled` : 'All repositories have the secret scanner enabled'

      result.status = 'failed'
      result.rationale = `${orgMessage}. ${repoMessage}`
      alert.description = `Check the details on ${check.details_url}`
      alert.title = `${orgMessage}. ${repoMessage}`
      task.description = `Check the details on ${check.details_url}`
      task.title = failedOrgs.size && failedRepos.length
        ? `Enable secret scanning for new repositories for the organization(s) (${[...failedOrgs].join(',')}) and ${failedRepos.length} (${percentageOfFailedRepos}) repositories`
        : failedOrgs.size
          ? `Enable secret scanning for new repositories for the organization(s) (${[...failedOrgs].join(',')})`
          : `Enable secret scanning for ${failedRepos.length} (${percentageOfFailedRepos}) repositories in the organization(s) (${Array.from(new Set(failedRepos)).join(',')})`
    } else if (unknownOrgs.size || unknownRepos.length) {
      result.status = 'unknown'

      orgMessage = `It was not possible to confirm if the organization(s) has enabled secret scanning for new repositories in the following (${[...unknownOrgs].join(',')}) organization(s)`
      repoMessage = 'It was not possible to confirm if some repositories has not enabled secret scanning'

      result.rationale = unknownOrgs.size && unknownRepos.length ? 'It was not possible to confirm if some organizations and repositories has not enabled secret scanning' : unknownOrgs.size ? `${orgMessage}` : `${repoMessage}`
    }

    // Include only the task if was populated
    if (Object.keys(task).length > Object.keys(baseData).length) {
      debug(`Adding task for project (${project.id})`)
      tasks.push(task)
    }
    // Include only the alert if was populated
    if (Object.keys(alert).length > Object.keys(baseData).length) {
      debug(`Adding alert for project (${project.id})`)
      alerts.push(alert)
    }
    // Always include the result
    results.push(result)
    debug(`Processed project (${project.id})`)
  })

  return {
    alerts,
    results,
    tasks
  }
}
