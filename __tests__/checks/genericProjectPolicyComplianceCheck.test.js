const knexInit = require('knex')
const { getConfig } = require('../../src/config')

const complianceChecks = require('../../src/checks')
const {
  resetDatabase, initializeStore
} = require('../../__utils__')

const { sampleGithubOrg } = require('../../__fixtures__')

const { dbSettings } = getConfig('test')

let knex
let check

let addProject,
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
    getAllResults,
    getAllTasks,
    getAllAlerts,
    addAlert,
    addTask,
    addResult,
    getCheckByCodeName
  } = initializeStore(knex))
  check = await getCheckByCodeName('defineFunctionalRoles')
})

beforeEach(async () => {
  await resetDatabase(knex)
})

afterAll(async () => {
  await knex.destroy()
})

describe('Integration: Generic Project Policy Compliance Checks', () => {
  // @TODO: ensure that the genericProjectPolicyComplianceCheck is used in the complianceChecks
  it('Should include all the generic Project policy compliance checks', () => {
    expect(complianceChecks).toHaveProperty('defineFunctionalRoles')
    expect(complianceChecks).toHaveProperty('orgToolingMFA')
    expect(complianceChecks).toHaveProperty('softwareArchitectureDocs')
    expect(complianceChecks).toHaveProperty('MFAImpersonationDefense')
    expect(complianceChecks).toHaveProperty('includeCVEInReleaseNotes')
    expect(complianceChecks).toHaveProperty('assignCVEForKnownVulns')
    expect(complianceChecks).toHaveProperty('incidentResponsePlan')
    expect(complianceChecks).toHaveProperty('regressionTestsForVulns')
    expect(complianceChecks).toHaveProperty('vulnResponse14Days')
    expect(complianceChecks).toHaveProperty('useCVDToolForVulns')
    expect(complianceChecks).toHaveProperty('securityMdMeetsOpenJSCVD')
    expect(complianceChecks).toHaveProperty('consistentBuildProcessDocs')
    expect(complianceChecks).toHaveProperty('machineReadableDependencies')
    expect(complianceChecks).toHaveProperty('identifyModifiedDependencies')
    expect(complianceChecks).toHaveProperty('ciAndCdPipelineAsCode')
    expect(complianceChecks).toHaveProperty('npmOrgMFA')
    expect(complianceChecks).toHaveProperty('npmPublicationMFA')
    expect(complianceChecks).toHaveProperty('upgradePathDocs')
  })

  test('Should add results without alerts or tasks', async () => {
    // Add a passed check scenario
    await addProject({ name: sampleGithubOrg.login, has_defineFunctionalRoles_policy: true })
    // Check that the database is empty
    let results = await getAllResults()
    expect(results.length).toBe(0)
    let alerts = await getAllAlerts()
    expect(alerts.length).toBe(0)
    let tasks = await getAllTasks()
    expect(tasks.length).toBe(0)
    // Run the check
    await expect(complianceChecks.defineFunctionalRoles(knex)).resolves.toBeUndefined()
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
    const project = await addProject({ name: sampleGithubOrg.login, has_defineFunctionalRoles_policy: true })
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
    await complianceChecks.defineFunctionalRoles(knex)
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
    // Prepare the Scenario
    const project = await addProject({ name: sampleGithubOrg.login, has_defineFunctionalRoles_policy: false })
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
    await complianceChecks.defineFunctionalRoles(knex)
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
})
