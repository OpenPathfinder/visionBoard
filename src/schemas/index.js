const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const githubOrganizationSchema = require('./githubOrganization.json')

const ajv = new Ajv()
addFormats(ajv)

const validateGithubOrg = (data) => {
  const validate = ajv.compile(githubOrganizationSchema)
  const valid = validate(data)
  if (!valid) {
    const readableErrors = validate.errors.map((error) => `[ERROR: ${error.keyword}]${error.schemaPath}: ${error.message}`).join('\n')
    throw new Error(`Error when validating the Github org response from API: ${readableErrors}`)
  }
  return null
}

module.exports = {
  validateGithubOrg
}
