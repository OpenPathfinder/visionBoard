const knexInit = require('knex')
const { getConfig } = require('../src/config')
const { resetDatabase } = require('../__utils__')

const { dbSettings } = getConfig('test')

/**
 * Global teardown for Playwright tests
 * This is run once after all tests are complete
 * It cleans up the database by resetting it
 */
async function globalTeardown () {
  console.log('Cleaning up after E2E tests...')

  // Initialize database connection
  const knex = knexInit(dbSettings)

  try {
    // Reset database to clean state
    await resetDatabase(knex)
    console.log('Database cleanup completed successfully')
  } catch (error) {
    console.error('Error cleaning up after E2E tests:', error)
    throw error
  } finally {
    // Close database connection
    await knex.destroy()
  }
}

module.exports = globalTeardown
