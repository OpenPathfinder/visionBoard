const debug = require('debug')('checks:validator:softwareDesignTraining')
const { getSeverityFromPriorityGroup, isDateWithinPolicy } = require('../../utils')

const expirationPolicy = '6m'

module.exports = ({ trainings = [], check, projects = [] }) => {
  debug('Validating Software Design Training...')
  const alerts = []
  const results = []
  const tasks = []

  debug('Processing Projects...')
  projects.forEach(project => {
    const baseData = {
      project_id: project.id,
      compliance_check_id: check.id,
      severity: getSeverityFromPriorityGroup(check.priority_group)
    }

    const result = { ...baseData }
    const task = { ...baseData }
    const alert = { ...baseData }

    const trainingDetails = trainings.find(training => training.project_id === project.id)
    if (!trainingDetails) {
      result.status = 'failed'
      result.rationale = 'No Software Design Training found'
      alert.title = 'No Software Design Training found'
      alert.description = `Check the details on ${check.details_url}`
      task.title = 'Create a Software Design Training'
      task.description = `Check the details on ${check.details_url}`
    } else if (trainingDetails?.training_date && !isDateWithinPolicy(trainingDetails.training_date, expirationPolicy)) {
      result.status = 'failed'
      result.rationale = 'Software Design Training is out of date'
      alert.title = 'Software Design Training is out of date'
      alert.description = `Check the details on ${check.details_url}`
      task.title = 'Update Software Design Training'
      task.description = `Check the details on ${check.details_url}`
    } else {
      result.status = 'passed'
      result.rationale = 'Software Design Training is up to date'
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
