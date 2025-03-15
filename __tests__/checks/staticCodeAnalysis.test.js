const knexInit = require('knex')
const { getConfig } = require('../../src/config')
const staticCodeAnalysis = require('../../src/checks/complianceChecks/staticCodeAnalysis')
const {
  resetDatabase, initializeStore, generateGithubRepoData,
  generateOSSFScorecardData
} = require('../../__utils__')
const { sampleGithubOrg } = require('../../__fixtures__')

const { dbSettings } = getConfig('test')

let knex,
  project,
  check,
  addProject,
  addGithubOrg,
  addGithubRepo,
  addOSSFScorecardResult,
  getAllResults,
  getAllTasks,
  getAllAlerts,
  addAlert,
  addTask,
  addResult,
  getCheckByCodeName

beforeAll(async () => {
  knex = knexInit(dbSettings);
  ({
    addProject,
    addGithubOrganization: addGithubOrg,
    addOSSFScorecardResult,
    addGithubRepo,
    getAllResults,
    getAllTasks,
    getAllAlerts,
    addAlert,
    addTask,
    addResult,
    getCheckByCodeName
  } = initializeStore(knex))
  check = await getCheckByCodeName('staticCodeAnalysis')
})

beforeEach(async () => {
  await resetDatabase(knex)
  project = await addProject({ name: sampleGithubOrg.login })
})

afterAll(async () => {
  await knex.destroy()
})

describe('Integration: staticCodeAnalysis', () => {
  test('Should add results without alerts or tasks', async () => {
    // Add a passed check scenario
    const org = await addGithubOrg({
      login: sampleGithubOrg.login,
      html_url: sampleGithubOrg.html_url,
      project_id: project.id
    })
    const repoData = generateGithubRepoData({ org, name: 'repo1', id: 1 })
    await addGithubRepo(repoData)

    const ossfResults = generateOSSFScorecardData({ github_repository_id: 1, sast_score: 10 })
    await addOSSFScorecardResult(ossfResults)

    // Check that the database is empty
    let results = await getAllResults()
    expect(results.length).toBe(0)
    let alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    let tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
    // Run the check
    await expect(staticCodeAnalysis(knex)).resolves.toBeUndefined()
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
  test('Should delete (previous alerts and tasks) and add results', async () => {
    // Prepare the Scenario
    const org = await addGithubOrg({
      login: sampleGithubOrg.login,
      html_url: sampleGithubOrg.html_url,
      project_id: project.id
    })
    const repoData = generateGithubRepoData({ org, name: 'repo1' })
    await addGithubRepo(repoData)

    const ossfResults = generateOSSFScorecardData({ github_repository_id: 1, sast_score: 10 })
    await addOSSFScorecardResult(ossfResults)

    await addAlert({ compliance_check_id: check.id, project_id: project.id, title: 'existing', description: 'existing', severity: 'critical' })
    await addTask({ compliance_check_id: check.id, project_id: project.id, title: 'existing', description: 'existing', severity: 'critical' })
    // Check that the database has the expected results
    let results = await getAllResults()
    expect(results.length).toBe(0)
    let alerts = await getAllAlerts()
    expect(alerts.length).toBe(1)
    expect(alerts[0].compliance_check_id).toBe(check.id)
    let tasks = await getAllTasks()
    expect(tasks.length).toBe(1)
    expect(tasks[0].compliance_check_id).toBe(check.id)
    // Run the check
    await staticCodeAnalysis(knex)
    // Check that the database has the expected results
    results = await getAllResults()
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('passed')
    alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
  })

  test('Should add (alerts and tasks) and update results', async () => {
    const org = await addGithubOrg({ login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id })
    const repoData = generateGithubRepoData({ org, name: 'repo1', secret_scanning_status: 'enabled' })
    await addGithubRepo(repoData)

    const ossfResults = generateOSSFScorecardData({ github_repository_id: 1, sast_score: 4 })
    await addOSSFScorecardResult(ossfResults)

    await addResult({ compliance_check_id: check.id, project_id: project.id, status: 'passed', rationale: 'failed previously', severity: 'critical' })
    // Check that the database has the expected results
    let results = await getAllResults()
    expect(results.length).toBe(1)
    expect(results[0].compliance_check_id).toBe(check.id)
    let alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    let tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
    // Run the check
    await staticCodeAnalysis(knex)
    // Check that the database has the expected results
    results = await getAllResults()
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('failed')
    expect(results[0].rationale).not.toBe('failed previously')
    alerts = await getAllAlerts()
    expect(alerts.length).toBe(1)
    expect(alerts[0].compliance_check_id).toBe(check.id)
    tasks = await getAllTasks()
    expect(tasks.length).toBe(1)
    expect(tasks[0].compliance_check_id).toBe(check.id)
  })
  test('Should add (alerts and tasks) and update results without repos and ossf_results', async () => {
    // Prepare the Scenario
    await addGithubOrg({ login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id })

    await addResult({ compliance_check_id: check.id, project_id: project.id, status: 'passed', rationale: 'failed previously', severity: 'critical' })
    // Check that the database has the expected results
    let results = await getAllResults()
    expect(results.length).toBe(1)
    expect(results[0].compliance_check_id).toBe(check.id)
    let alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    let tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
    // Run the check
    await staticCodeAnalysis(knex)
    // Check that the database has the expected results
    results = await getAllResults()
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('passed')
    expect(results[0].rationale).not.toBe('failed previously')
    alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
  })

  test('Should add (alerts and tasks) and update results without ossf_results', async () => {
    // Add a passed check scenario
    const org = await addGithubOrg({
      login: sampleGithubOrg.login,
      html_url: sampleGithubOrg.html_url,
      project_id: project.id
    })
    const repoData = generateGithubRepoData({ org, name: 'repo1', id: 1 })
    await addGithubRepo(repoData)

    // Check that the database is empty
    let results = await getAllResults()
    expect(results.length).toBe(0)
    let alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    let tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
    // Run the check
    await expect(staticCodeAnalysis(knex)).resolves.toBeUndefined()
    // Check that the database has the expected results
    results = await getAllResults()
    expect(results.length).toBe(1)
    expect(results[0].status).toBe('unknown')
    expect(results[0].compliance_check_id).toBe(check.id)
    alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
  })
})
