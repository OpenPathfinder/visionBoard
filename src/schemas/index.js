const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const githubOrganizationSchema = require('./githubOrganization.json')
const githubListOrgReposSchema = require('./githubListOrgRepos.json')
const githubListOrgMembersSchema = require('./githubListOrgMembers.json')
const githubRepositorySchema = require('./githubRepository.json')
const ossfScorecardResultSchema = require('./ossfScorecardResult.json')
const bulkImportSchema = require('./bulkImport.json')

const ajv = new Ajv()
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

const validateGithubListOrgRepos = (data) => {
  const validate = ajv.compile(githubListOrgReposSchema)
  const valid = validate(data)
  if (!valid) {
    const readableErrors = getReadableErrors(validate)
    throw new Error(`Error when validating the Github org response from API: ${readableErrors}`)
  }
  return null
}

const validateGithubListOrgMembers = (data) => {
  const validate = ajv.compile(githubListOrgMembersSchema)
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

module.exports = {
  validateGithubOrg,
  validateGithubListOrgRepos,
  validateGithubListOrgMembers,
  validateGithubRepository,
  validateOSSFResult,
  validateBulkImport
}
