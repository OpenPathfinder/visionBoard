const inquirer = require('inquirer').default
const knexInit = require('knex')
const { getConfig } = require('../../src/config')

const { listCheckCommand } = require('../../src/cli')
const { resetDatabase, getAllComplianceChecks } = require('../../__utils__')

const { dbSettings } = getConfig('test')

describe('check related commands', () => {
  let knex

  beforeAll(() => {
    knex = knexInit(dbSettings)
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
      const checks = await getAllComplianceChecks(knex)
      // Ensure that there are checks available
      expect(checks.length).not.toBe(0)
      // Filter relevant checks
      const relevantChecks = checks.filter(check => check.implementation_status === 'completed')
      const availableChecksList = await listCheckCommand(knex)
      await expect(availableChecksList).toEqual(relevantChecks)
    })
  })
})
