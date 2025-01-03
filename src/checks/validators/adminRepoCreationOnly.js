const debug = require('debug')('checks:validator:adminRepoCreationOnly')
const { getSeverityFromPriorityGroup, groupArrayItemsByCriteria } = require('../../utils')

const groupByProject = groupArrayItemsByCriteria('project_id')

// @see: https://github.com/OpenPathfinder/visionBoard/issues/75
module.exports = ({ organizations = [], check, projects = [] }) => {
  debug('Validating that only admins can create public repositories...')
  debug('Grouping organizations by project...')
  const organizationsGroupedByProject = groupByProject(organizations)

  const alerts = []
  const results = []
  const tasks = []

  debug('Processing organizations...')
  organizationsGroupedByProject.forEach((projectOrgs) => {
    debug(`Processing project (${projectOrgs[0].project_id})`)
    const project = projects.find(p => p.id === projectOrgs[0].project_id)

    const baseData = {
      project_id: projectOrgs[0].project_id,
      compliance_check_id: check.id,
      severity: getSeverityFromPriorityGroup(check.default_priority_group)
    }

    const result = { ...baseData }
    const task = { ...baseData }
    const alert = { ...baseData }

    const failedOrgs = projectOrgs.filter(org => org.members_can_create_public_repositories === true).map(org => org.login)
    const unknownOrgs = projectOrgs.filter(org => org.members_can_create_public_repositories === null).map(org => org.login)

    if (projectOrgs.every(org => org.members_can_create_public_repositories === false)) {
      result.status = 'passed'
      result.rationale = 'Only Admins can create public repositories in the organization(s)'
    } else if (failedOrgs.length) {
      result.status = 'failed'
      result.rationale = `Not Only Admins can create public repositories in the following (${failedOrgs.join(',')}) organization(s)`
      alert.title = `Not Only Admins can create public repositories in the following (${failedOrgs.join(',')}) organization(s)`
      alert.description = `Check the details on ${check.details_url}`
      task.title = `Limit public repo creation to admins for the following (${failedOrgs.join(',')}) organization(s)`
      task.description = `Check the details on ${check.details_url}`
    } else if (unknownOrgs.length) {
      result.status = 'unknown'
      result.rationale = `It was not possible to confirm if only admins can create public repositories in the following (${unknownOrgs.join(',')}) organization(s)`
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
