const knexInit = require('knex')
const { getConfig } = require('../../src/config')
const githubOrgMFA = require('../../src/checks/complianceChecks/githubOrgMFA')
const {
  resetDatabase, addProject, addGithubOrg, getAllResults, getAllTasks, getAllAlerts,
  addAlert, addTask, addResult, getCheckByCodeName
} = require('../../__utils__')
const { sampleGithubOrg } = require('../../__fixtures__')

const { dbSettings } = getConfig('test')

let knex
let project
let check

beforeAll(async () => {
  knex = knexInit(dbSettings)
  check = await getCheckByCodeName(knex, 'githubOrgMFA')
})

beforeEach(async () => {
  await resetDatabase(knex)
  project = await addProject(knex, { name: sampleGithubOrg.login, category: 'impact' })
})

afterAll(async () => {
  await knex.destroy()
})

describe('Integration: githubOrgMFA', () => {
  test('Should add results without alerts or tasks', async () => {
    // Add a passed check scenario
    await addGithubOrg(knex, { login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id, two_factor_requirement_enabled: true })
    // Check that the database is empty
    let results = await getAllResults(knex)
    expect(results.length).toBe(0)
    let alerts = await getAllAlerts(knex)
    expect(alerts.length).toBe(0)
    let tasks = await getAllTasks(knex)
    expect(tasks.length).toBe(0)
    // Run the check
    await expect(githubOrgMFA(knex)).resolves.toBeUndefined()
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

  test('Should delete (previous alerts and tasks) and add results', async () => {
    // Prepare the Scenario
    await addGithubOrg(knex, { login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id, two_factor_requirement_enabled: true })
    await addAlert(knex, { compliance_check_id: check.id, project_id: project.id, title: 'existing', description: 'existing', severity: 'critical' })
    await addTask(knex, { compliance_check_id: check.id, project_id: project.id, title: 'existing', description: 'existing', severity: 'critical' })
    // Check that the database has the expected results
    let results = await getAllResults(knex)
    expect(results.length).toBe(0)
    let alerts = await getAllAlerts(knex)
    expect(alerts.length).toBe(1)
    expect(alerts[0].compliance_check_id).toBe(check.id)
    let tasks = await getAllTasks(knex)
    expect(tasks.length).toBe(1)
    expect(tasks[0].compliance_check_id).toBe(check.id)
    // Run the check
    await githubOrgMFA(knex)
    // Check that the database has the expected results
    results = await getAllResults(knex)
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('passed')
    alerts = await getAllAlerts(knex)
    expect(alerts.length).toBe(0)
    tasks = await getAllTasks(knex)
    expect(tasks.length).toBe(0)
  })
  test('Should add (alerts and tasks) and update results', async () => {
    // Prepare the Scenario
    await addGithubOrg(knex, { login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id, two_factor_requirement_enabled: false })
    await addResult(knex, { compliance_check_id: check.id, project_id: project.id, status: 'passed', rationale: 'failed previously', severity: 'critical' })
    // Check that the database has the expected results
    let results = await getAllResults(knex)
    expect(results.length).toBe(1)
    expect(results[0].compliance_check_id).toBe(check.id)
    let alerts = await getAllAlerts(knex)
    expect(alerts.length).toBe(0)
    let tasks = await getAllTasks(knex)
    expect(tasks.length).toBe(0)
    // Run the check
    await githubOrgMFA(knex)
    // Check that the database has the expected results
    results = await getAllResults(knex)
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('failed')
    expect(results[0].rationale).not.toBe('failed previously')
    alerts = await getAllAlerts(knex)
    expect(alerts.length).toBe(1)
    expect(alerts[0].compliance_check_id).toBe(check.id)
    tasks = await getAllTasks(knex)
    expect(tasks.length).toBe(1)
    expect(tasks[0].compliance_check_id).toBe(check.id)
  })
})
