const inquirer = require('inquirer').default
const knexInit = require('knex')
const { getConfig } = require('../../src/config')

const { listCheckCommand } = require('../../src/cli')
const { resetDatabase, initializeStore } = require('../../__utils__')

const { dbSettings } = getConfig('test')

let knex
let getAllComplianceChecks

beforeAll(() => {
  knex = knexInit(dbSettings);
  ({
    getAllComplianceChecks
  } = initializeStore(knex))
})
beforeEach(async () => {
  await resetDatabase(knex)
  jest.clearAllMocks()
})
afterEach(jest.clearAllMocks)
afterAll(async () => {
  await resetDatabase(knex)
  await knex.destroy()
})
describe('list - Non-Interactive Mode', () => {
  jest.spyOn(inquirer, 'prompt').mockImplementation(async () => ({}))

  test('Should provide a list of available workflows', async () => {
    const checks = await getAllComplianceChecks()
    // Ensure that there are checks available
    expect(checks.length).not.toBe(0)
    // Filter relevant checks
    const relevantChecks = checks.filter(check => check.implementation_status === 'completed')
    const availableChecksList = await listCheckCommand(knex)
    await expect(availableChecksList).toEqual(relevantChecks)
  })
})

describe('run - Interactive Mode', () => {
  test.todo('Should run the check when a valid name is provided')
})
describe('run - Non-Interactive Mode', () => {
  test.todo('Should throw an error when invalid name is provided')
  test.todo('Should throw an error when no name is provided')
  test.todo('Should throw an error when the check is not implemented')
  test.todo('Should run the check when a valid name is provided')
})
