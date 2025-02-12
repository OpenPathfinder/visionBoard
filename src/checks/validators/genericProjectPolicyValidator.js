const debugInstance = require('debug')
const { getSeverityFromPriorityGroup } = require('../../utils')

module.exports = (checkName) => ({ check, projects = [] }) => {
  const debug = debugInstance(`checks:validator:${checkName}`)
  debug('Starting validation process...')
  const alerts = []
  const results = []
  const tasks = []

  debug('Processing projects...')
  projects.forEach((project) => {
    debug(`Processing project (${project.id})`)

    const baseData = {
      project_id: project.id,
      compliance_check_id: check.id,
      severity: getSeverityFromPriorityGroup(check.default_priority_group)
    }

    const result = { ...baseData }
    const task = { ...baseData }
    const alert = { ...baseData }

    const columnInScope = `has_${checkName}_policy`

    result.status = 'passed'
    result.rationale = `The project subscribes to the ${checkName} policy`

    if (project[columnInScope] === false) {
      result.status = 'failed'
      result.rationale = `The project does not subscribe to the ${checkName} policy`
      alert.title = `The project does not subscribe to the ${checkName} policy`
      alert.description = `Check the details on ${check.details_url}`
      task.title = `Subscribe to the ${checkName} policy`
      task.description = `Check the details on ${check.details_url}`
    }

    if (typeof project[columnInScope] !== 'boolean') {
      result.status = 'unknown'
      result.rationale = `The project has the policy ${checkName} with an unknown status`
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
