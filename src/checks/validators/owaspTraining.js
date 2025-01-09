const debug = require('debug')('checks:validator:owaspTraining')
const { getSeverityFromPriorityGroup, isDateWithinPolicy } = require('../../utils')

const expirationPolicy = '6m'

module.exports = ({ trainings = [], check, projects = [] }) => {
  debug('Validating Owasp Top 10 Training...')
  const alerts = []
  const results = []
  const tasks = []

  debug('Processing Projects...')
  projects.forEach(project => {
    const baseData = {
      project_id: project.id,
      compliance_check_id: check.id,
      severity: getSeverityFromPriorityGroup(check.default_priority_group)
    }

    const result = { ...baseData }
    const task = { ...baseData }
    const alert = { ...baseData }

    const trainingDetails = trainings.find(training => training.project_id === project.id)

    if (!trainingDetails) {
      result.status = 'failed'
      result.rationale = 'No Owasp Top 10 Training found'
      alert.title = 'No Owasp Top 10 Training found'
      alert.description = `Check the details on ${check.details_url}`
      task.title = 'Create a Owasp Top 10 Training'
      task.description = `Check the details on ${check.details_url}`
    } else if (trainingDetails?.training_date && !isDateWithinPolicy(trainingDetails.training_date, expirationPolicy)) {
      result.status = 'failed'
      result.rationale = 'Owasp Top 10 Training is out of date'
      alert.title = 'Owasp Top 10 Training is out of date'
      alert.description = `Check the details on ${check.details_url}`
      task.title = 'Update Owasp Top 10 Training'
      task.description = `Check the details on ${check.details_url}`
    } else {
      result.status = 'passed'
      result.rationale = 'Owasp Top 10 Training is up to date'
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
