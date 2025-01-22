const knexInit = require('knex')
const { getConfig } = require('../src/config')

const { dbSettings } = getConfig('test')

const {
  resetDatabase
} = require('../__utils__')

let knex

describe('Migrations', () => {
  beforeAll(async () => {
    knex = knexInit(dbSettings)
    await knex.migrate.latest()
  })
  beforeEach(async () => {
    await resetDatabase(knex)
  })
  afterAll(async () => {
    await knex.destroy()
  })

  it('should run migrations successfully', async () => {
    const result = await knex.migrate.latest()
    expect(result).not.toBeNull()
    const complianceChecksCount = await knex('compliance_checks').count()
    expect(Number.parseInt(complianceChecksCount[0].count)).toBe(72)
  })

  it('should restore compliance_checks table after rolling back', async () => {
    const result = await knex.migrate.latest()
    expect(result).not.toBeNull()
    const complianceChecksCount = await knex('compliance_checks').count()
    expect(Number.parseInt(complianceChecksCount[0].count)).toBe(72)

    const complianceChecksCountBeforeRollback = await knex('compliance_checks')
      .select('*')
      .limit(1)
    expect(complianceChecksCountBeforeRollback.length).toBe(1)
    expect(complianceChecksCountBeforeRollback[0]).not.toHaveProperty('mitre_url')
    expect(complianceChecksCountBeforeRollback[0]).not.toHaveProperty('mitre_description')

    await knex.migrate.down()

    const complianceChecksCountAfterRollback = await knex('compliance_checks')
      .select('*')
    complianceChecksCountAfterRollback.forEach((item) => {
      expect(item).toHaveProperty('mitre_url')
      expect(item).toHaveProperty('mitre_description')
    })
  })
})
