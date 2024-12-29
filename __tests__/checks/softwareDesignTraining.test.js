const knexInit = require('knex')
const { getConfig } = require('../../src/config')
const softwareDesignTraining = require('../../src/checks/complianceChecks/softwareDesignTraining')
const {
  resetDatabase, initializeStore
} = require('../../__utils__')

const { dbSettings } = getConfig('test')

let knex
let project
let check

let addProject,
  getAllResults,
  getAllTasks,
  getAllAlerts,
  addAlert,
  addTask,
  addResult,
  getCheckByCodeName,
  addSSoftwareDesignTraining,
  getAllSSoftwareDesignTrainings

beforeAll(async () => {
  knex = knexInit(dbSettings);
  ({
    addProject,
    addGithubOrganization: addGithubOrg,
    addSSoftwareDesignTraining,
    getAllSSoftwareDesignTrainings,
    getAllResults,
    getAllTasks,
    getAllAlerts,
    addAlert,
    addTask,
    addResult,
    getAllGithubOrganizations,
    getCheckByCodeName
  } = initializeStore(knex))
  check = await getCheckByCodeName('softwareDesignTraining')
})

beforeEach(async () => {
  await resetDatabase(knex);
  [project] = await addProject({ name: 'project', category: 'impact' })
})

afterAll(async () => {
  await knex.destroy()
})

describe('Integration: softwareDesignTraining', () => {
  test('Should add results without alerts or tasks', async () => {
    // Add a passed check scenario
    await addSSoftwareDesignTraining({ project_id: project.id, description: 'learning accomplished', training_date: new Date().toISOString() })
    let trainings = await getAllSSoftwareDesignTrainings()
    expect(trainings.length).toBe(1)
    // Check that the database is empty
    let results = await getAllResults()
    expect(results.length).toBe(0)
    let alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    let tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
    // Run the check
    await expect(softwareDesignTraining(knex)).resolves.toBeUndefined()
    // Check that the database has the expected results
    trainings = await getAllSSoftwareDesignTrainings()
    expect(trainings.length).toBe(1)
    results = await getAllResults()
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('passed')
    expect(results[0].compliance_check_id).toBe(check.id)
    alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
  })
  test('Should delete (previous alerts and tasks) and add results', async () => {
    // Add a passed check scenario
    await addSSoftwareDesignTraining({ project_id: project.id, description: 'learning accomplished', training_date: new Date().toISOString() })
    // Add previous alerts and tasks
    await addAlert({ compliance_check_id: check.id, project_id: project.id, title: 'existing', description: 'existing', severity: 'critical' })
    await addTask({ compliance_check_id: check.id, project_id: project.id, title: 'existing', description: 'existing', severity: 'critical' })
    // Check that the database has the expected results
    const trainings = await getAllSSoftwareDesignTrainings()
    expect(trainings.length).toBe(1)
    let results = await getAllResults()
    expect(results.length).toBe(0)
    let alerts = await getAllAlerts()
    expect(alerts.length).toBe(1)
    expect(alerts[0].compliance_check_id).toBe(check.id)
    let tasks = await getAllTasks()
    expect(tasks.length).toBe(1)
    expect(tasks[0].compliance_check_id).toBe(check.id)
    // Run the check
    await expect(softwareDesignTraining(knex)).resolves.toBeUndefined()
    // Check that the database has the expected results
    results = await getAllResults()
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('passed')
    expect(results[0].compliance_check_id).toBe(check.id)
    alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
  })
  test('Should add (alerts and tasks) and update results', async () => {
    await addResult({ compliance_check_id: check.id, project_id: project.id, status: 'failed', rationale: 'failed previously', severity: 'critical' })
    // Check that the database is empty
    let results = await getAllResults()
    expect(results.length).toBe(1)
    expect(results[0].compliance_check_id).toBe(check.id)
    let trainings = await getAllSSoftwareDesignTrainings()
    expect(trainings.length).toBe(0)
    let alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    let tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
    // Run the check
    await expect(softwareDesignTraining(knex)).resolves.toBeUndefined()
    // Check that the database has the expected results
    results = await getAllResults()
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('failed')
    expect(results[0].rationale).not.toBe('failed previously')
    expect(results[0].compliance_check_id).toBe(check.id)
    trainings = await getAllSSoftwareDesignTrainings()
    expect(trainings.length).toBe(0)
    alerts = await getAllAlerts()
    expect(alerts.length).toBe(1)
    expect(alerts[0].compliance_check_id).toBe(check.id)
    tasks = await getAllTasks()
    expect(tasks.length).toBe(1)
    expect(tasks[0].compliance_check_id).toBe(check.id)
  })
})
