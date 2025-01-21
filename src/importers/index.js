const { logger } = require('../utils')
const { validateBulkImport } = require('../schemas')
const { initializeStore } = require('../store')
const { simplifyObject } = require('@ulisesgascon/simplify-object')
const fs = require('fs')

const bulkImport = async (knex, filePath) => {
  logger.info('Bulk importing data...')
  const { upsertSoftwareDesignTraining } = initializeStore(knex)

  if (!fs.existsSync(filePath)) {
    logger.error(`File not found: ${filePath}`)
    throw new Error('File not found')
  }
  // Try to read the file
  let data
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    logger.info('Check the documentation for the expected file format in https://openpathfinder.com/docs/visionBoard/importers')
    logger.error(`Error reading file: ${error.message}`)
    throw error
  }

  // Validate the data
  try {
    validateBulkImport(data)
  } catch (error) {
    logger.info('Check the data schema in https://github.com/OpenPathfinder/visionBoard/blob/main/src/schemas/bulkImport.json')
    logger.error('Error validating the data')
    throw error
  }

  validateBulkImport(data)

  // Update de database
  for await (const item of data) {
    if (item.type === 'softwareDesignTraining') {
      logger.info('Upserting software design training data...')
      await upsertSoftwareDesignTraining(simplifyObject(item, {
        exclude: ['type']
      }))
    }
  }

  logger.info('Bulk importing completed')
}

module.exports = {
  bulkImport
}
