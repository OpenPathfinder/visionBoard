const validators = require('../validators')
const { initializeStore } = require('../../store')
const debug = require('debug')('checks:softwareDesignTraining')

module.exports = async (knex) => {
  const {
    getAllSSoftwareDesignTrainings, getCheckByCodeName,
    getAllProjects, addAlert, addTask, upsertComplianceCheckResult,
    deleteAlertsByComplianceCheckId, deleteTasksByComplianceCheckId
  } = initializeStore(knex)
  debug('Collecting relevant data...')
  const check = await getCheckByCodeName('softwareDesignTraining')
  const trainings = await getAllSSoftwareDesignTrainings()
  const projects = await getAllProjects()

  debug('Extracting the validation results...')
  const analysis = validators.softwareDesignTraining({ trainings, check, projects })
  debug('Deleting previous alerts and tasks to avoid orphaned records...')
  await deleteAlertsByComplianceCheckId(check.id)
  await deleteTasksByComplianceCheckId(check.id)

  debug('Upserting the new results...')
  await Promise.all(analysis.results.map(result => upsertComplianceCheckResult(result)))

  debug('Inserting the new Alerts and Tasks...')
  await Promise.all(analysis.alerts.map(alert => addAlert(alert)))
  await Promise.all(analysis.tasks.map(task => addTask(task)))
}
