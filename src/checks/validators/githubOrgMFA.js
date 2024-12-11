const debug = require('debug')('checks:validator:githubOrgMFA')
const { getSeverityFromPriorityGroup, isCheckApplicableToProjectCategory, groupArrayItemsByCriteria } = require('../../utils')

const groupByProject = groupArrayItemsByCriteria('project_id')

// @see: https://github.com/secure-dashboards/openjs-foundation-dashboard/issues/43
module.exports = ({ organizations, check, projects }) => {
  debug('Validating GitHub organizations MFA...')
  debug('Grouping organizations by project...')
  const organizationsGroupedByProject = groupByProject(organizations)

  const alerts = []
  const results = []
  const tasks = []

  debug('Processing organizations...')
  organizationsGroupedByProject.forEach((projectOrgs) => {
    debug(`Processing project (${projectOrgs[0].project_id})`)
    const project = projects.find(p => p.id === projectOrgs[0].project_id)
    const isInScope = isCheckApplicableToProjectCategory(check, project)
    // If the check is not in scope, skip it.
    if (!isInScope) {
      debug(`This check is not in scope for project (${project.id})`)
      return
    }

    const baseData = {
      project_id: projectOrgs[0].project_id,
      compliance_check_id: check.id,
      severity: getSeverityFromPriorityGroup(check.priority_group)
    }

    const result = { ...baseData }
    const task = { ...baseData }
    const alert = { ...baseData }

    const failedOrgs = projectOrgs.filter(org => org.two_factor_requirement_enabled === false).map(org => org.login)
    const unknownOrgs = projectOrgs.filter(org => org.two_factor_requirement_enabled === null).map(org => org.login)

    if (projectOrgs.every(org => org.two_factor_requirement_enabled === true)) {
      result.status = 'passed'
      result.rationale = 'The organization(s) have 2FA enabled'
    } else if (failedOrgs.length) {
      result.status = 'failed'
      result.rationale = `The organization(s) (${failedOrgs.join(',')}) do not have 2FA enabled`
      alert.title = `The organization(s) (${failedOrgs.join(',')}) do not have 2FA enabled`
      alert.description = `Check the details on ${check.details_url}`
      task.title = `Enable 2FA for the organization(s) (${failedOrgs.join(',')})`
      task.description = `Check the details on ${check.details_url}`
    } else if (unknownOrgs.length) {
      result.status = 'unknown'
      result.rationale = `The organization(s) (${unknownOrgs.join(',')}) have 2FA status unknown`
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
