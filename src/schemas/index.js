const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const githubOrganizationSchema = require('./githubOrganization.json')
const githubListOrgReposSchema = require('./githubListOrgRepos.json')
const githubRepositorySchema = require('./githubRepository.json')
const ossfScorecardResultSchema = require('./ossfScorecardResult.json')
const bulkImportSchema = require('./bulkImport.json')
const projectDataSchema = require('./projectData.json')
const indexDataSchema = require('./indexData.json')
const executeOneCheckSchema = require('./execute-one-check.json')
const executeOptionalProjectSchema = require('./execute-optional-project.json')

const ajv = new Ajv({
  allowUnionTypes: true // Allow union types for fields like Date/string
})
addFormats(ajv)

const getReadableErrors = validate => validate.errors.map((error) => `[ERROR: ${error.keyword}]${error.schemaPath}: ${error.message}`).join('\n')

const validateGithubOrg = (data) => {
  const validate = ajv.compile(githubOrganizationSchema)
  const valid = validate(data)
  if (!valid) {
    const readableErrors = getReadableErrors(validate)
    throw new Error(`Error when validating the Github org response from API: ${readableErrors}`)
  }
  return null
}

const validateExecuteOneCheck = (data) => {
  const validate = ajv.compile(executeOneCheckSchema)
  const valid = validate(data)
  if (!valid) {
    const readableErrors = getReadableErrors(validate)
    throw new Error(`Error when validating the execute one check request: ${readableErrors}`)
  }
  return null
}

const validateGithubListOrgRepos = (data) => {
  const validate = ajv.compile(githubListOrgReposSchema)
  const valid = validate(data)
  if (!valid) {
    const readableErrors = getReadableErrors(validate)
    throw new Error(`Error when validating the Github org response from API: ${readableErrors}`)
  }
  return null
}

const validateGithubRepository = (data) => {
  const validate = ajv.compile(githubRepositorySchema)
  const valid = validate(data)
  if (!valid) {
    const readableErrors = getReadableErrors(validate)
    throw new Error(`Error when validating the Github repository response from API: ${readableErrors}`)
  }
  return null
}

const validateOSSFResult = (data) => {
  const validate = ajv.compile(ossfScorecardResultSchema)
  const valid = validate(data)
  if (!valid) {
    const readableErrors = getReadableErrors(validate)
    throw new Error(`Error when validating the OSSF Scorecard result: ${readableErrors}`)
  }
  return null
}

const validateBulkImport = (data) => {
  const validate = ajv.compile(bulkImportSchema)
  const valid = validate(data)
  if (!valid) {
    const readableErrors = getReadableErrors(validate)
    throw new Error(`Error when validating the bulk import data: ${readableErrors}`)
  }
  return null
}

const validateProjectData = (data) => {
  const validate = ajv.compile(projectDataSchema)
  const valid = validate(data)
  if (!valid) {
    const readableErrors = getReadableErrors(validate)
    throw new Error(`Error when validating project data: ${readableErrors}`)
  }
  return null
}

const validateIndexData = (data) => {
  const validate = ajv.compile(indexDataSchema)
  const valid = validate(data)
  if (!valid) {
    const readableErrors = getReadableErrors(validate)
    throw new Error(`Error when validating index data: ${readableErrors}`)
  }
  return null
}

module.exports = {
  validateGithubOrg,
  validateGithubListOrgRepos,
  validateGithubRepository,
  validateOSSFResult,
  validateBulkImport,
  validateProjectData,
  validateIndexData,
  validateExecuteOneCheck,
  executeOneCheckSchema,
  executeOptionalProjectSchema,
  bulkImportSchema
}
