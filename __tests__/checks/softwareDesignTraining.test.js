const knexInit = require('knex')
const { getConfig } = require('../../src/config')
const softwareDesignTraining = require('../../src/checks/complianceChecks/softwareDesignTraining')
const {
  resetDatabase, addProject, getAllResults, getAllTasks, getAllAlerts,
  addAlert, addTask, addResult, getCheckByCodeName, addSSoftwareDesignTraining, getAllSoftwareDesignTrainings
} = require('../../__utils__')

const { dbSettings } = getConfig('test')

let knex
let project
let check

beforeAll(async () => {
  knex = knexInit(dbSettings)
  check = await getCheckByCodeName(knex, 'softwareDesignTraining')
})

beforeEach(async () => {
  await resetDatabase(knex)
  project = await addProject(knex, { name: 'project', category: 'impact' })
})

afterAll(async () => {
  await knex.destroy()
})

describe('Integration: softwareDesignTraining', () => {
  test('Should add results without alerts or tasks', async () => {
    // Add a passed check scenario
    await addSSoftwareDesignTraining(knex, { project_id: project.id, description: 'learning accomplished', training_date: new Date().toISOString() })
    let trainings = await getAllSoftwareDesignTrainings(knex)
    expect(trainings.length).toBe(1)
    // Check that the database is empty
    let results = await getAllResults(knex)
    expect(results.length).toBe(0)
    let alerts = await getAllAlerts(knex)
    expect(alerts.length).toBe(0)
    let tasks = await getAllTasks(knex)
    expect(tasks.length).toBe(0)
    // Run the check
    await expect(softwareDesignTraining(knex)).resolves.toBeUndefined()
    // Check that the database has the expected results
    trainings = await getAllSoftwareDesignTrainings(knex)
    expect(trainings.length).toBe(1)
    results = await getAllResults(knex)
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('passed')
    expect(results[0].compliance_check_id).toBe(check.id)
    alerts = await getAllAlerts(knex)
    expect(alerts.length).toBe(0)
    tasks = await getAllTasks(knex)
    expect(tasks.length).toBe(0)
  })
  test('Should delete (previous alerts and tasks) and add results', async () => {
    // Add a passed check scenario
    await addSSoftwareDesignTraining(knex, { project_id: project.id, description: 'learning accomplished', training_date: new Date().toISOString() })
    // Add previous alerts and tasks
    await addAlert(knex, { compliance_check_id: check.id, project_id: project.id, title: 'existing', description: 'existing', severity: 'critical' })
    await addTask(knex, { compliance_check_id: check.id, project_id: project.id, title: 'existing', description: 'existing', severity: 'critical' })
    // Check that the database has the expected results
    const trainings = await getAllSoftwareDesignTrainings(knex)
    expect(trainings.length).toBe(1)
    let results = await getAllResults(knex)
    expect(results.length).toBe(0)
    let alerts = await getAllAlerts(knex)
    expect(alerts.length).toBe(1)
    expect(alerts[0].compliance_check_id).toBe(check.id)
    let tasks = await getAllTasks(knex)
    expect(tasks.length).toBe(1)
    expect(tasks[0].compliance_check_id).toBe(check.id)
    // Run the check
    await expect(softwareDesignTraining(knex)).resolves.toBeUndefined()
    // Check that the database has the expected results
    results = await getAllResults(knex)
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('passed')
    expect(results[0].compliance_check_id).toBe(check.id)
    alerts = await getAllAlerts(knex)
    expect(alerts.length).toBe(0)
    tasks = await getAllTasks(knex)
    expect(tasks.length).toBe(0)
  })
  test('Should add (alerts and tasks) and update results', async () => {
    await addResult(knex, { compliance_check_id: check.id, project_id: project.id, status: 'failed', rationale: 'failed previously', severity: 'critical' })
    // Check that the database is empty
    let results = await getAllResults(knex)
    expect(results.length).toBe(1)
    expect(results[0].compliance_check_id).toBe(check.id)
    let trainings = await getAllSoftwareDesignTrainings(knex)
    expect(trainings.length).toBe(0)
    let alerts = await getAllAlerts(knex)
    expect(alerts.length).toBe(0)
    let tasks = await getAllTasks(knex)
    expect(tasks.length).toBe(0)
    // Run the check
    await expect(softwareDesignTraining(knex)).resolves.toBeUndefined()
    // Check that the database has the expected results
    results = await getAllResults(knex)
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('failed')
    expect(results[0].rationale).not.toBe('failed previously')
    expect(results[0].compliance_check_id).toBe(check.id)
    trainings = await getAllSoftwareDesignTrainings(knex)
    expect(trainings.length).toBe(0)
    alerts = await getAllAlerts(knex)
    expect(alerts.length).toBe(1)
    expect(alerts[0].compliance_check_id).toBe(check.id)
    tasks = await getAllTasks(knex)
    expect(tasks.length).toBe(1)
    expect(tasks[0].compliance_check_id).toBe(check.id)
  })
})
