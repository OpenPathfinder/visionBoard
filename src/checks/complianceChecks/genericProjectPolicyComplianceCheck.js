const validators = require('../validators')
const debugInstance = require('debug')
const { initializeStore } = require('../../store')

module.exports = (checkName) => async (knex, { projects } = {}) => {
  const debug = debugInstance(`checks:${checkName}`)
  const {
    getCheckByCodeName,
    getAllProjects, addAlert, addTask, upsertComplianceCheckResult,
    deleteAlertsByComplianceCheckId, deleteTasksByComplianceCheckId
  } = initializeStore(knex)
  debug('Collecting relevant data...')
  const check = await getCheckByCodeName(checkName)
  if (!projects || (Array.isArray(projects) && projects.length === 0)) {
    projects = await getAllProjects()
  }

  debug('Extracting the validation results...')
  const analysis = validators[checkName]({ projects, check })

  debug('Deleting previous alerts and tasks to avoid orphaned records...')
  await deleteAlertsByComplianceCheckId(check.id)
  await deleteTasksByComplianceCheckId(check.id)

  debug('Upserting the new results...')
  await Promise.all(analysis.results.map(result => upsertComplianceCheckResult(result)))

  debug('Inserting the new Alerts and Tasks...')
  await Promise.all(analysis.alerts.map(alert => addAlert(alert)))
  await Promise.all(analysis.tasks.map(task => addTask(task)))
}
