const knexInit = require('knex')
const { getConfig } = require('../../src/config')
const staticCodeAnalysis = require('../../src/checks/complianceChecks/staticCodeAnalysis')
const {
  resetDatabase, initializeStore, generateGithubRepoData
} = require('../../__utils__')
const { sampleGithubOrg } = require('../../__fixtures__')

const { dbSettings } = getConfig('test')

let knex,
  project,
  check,
  addProject,
  addGithubOrg,
  addGithubRepo,
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
  test.todo('Should add results without alerts or tasks')
  test.todo('Should delete (previous alerts and tasks) and add results')
  test.todo('Should add (alerts and tasks) and update results')
  test.todo('Should add (alerts and tasks) and update results without repos and ossf_results')
  test.todo('Should add (alerts and tasks) and update results without repos')
  test.todo('Should add (alerts and tasks) and update results without ossf_results')
})
