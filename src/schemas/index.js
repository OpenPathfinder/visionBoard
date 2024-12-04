const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const githubOrganizationSchema = require('./githubOrganization.json')

const ajv = new Ajv()
addFormats(ajv)

const validateGithubOrg = (data) => {
  const validate = ajv.compile(githubOrganizationSchema)
  const valid = validate(data)
  if (!valid) {
    throw new Error(validate.errors.map((error) => error.message).join('\n'))
  }
  return null
}

module.exports = {
  validateGithubOrg
}
