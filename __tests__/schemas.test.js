const { sampleGithubOrg } = require('../__fixtures__')
const { validateGithubOrg } = require('../src/schemas')

describe('schemas', () => {
  describe('validateGithubOrg', () => {
    test('Should not throw an error with valid data', () => {
      expect(() => validateGithubOrg(sampleGithubOrg)).not.toThrow()
    })

    test('Should not throw with additional data', () => {
      const additionalData = { ...sampleGithubOrg, additionalKey: 'value' }
      expect(() => validateGithubOrg(additionalData)).not.toThrow()
    })

    test('Should throw an error with invalid data', () => {
      const invalidData = { ...sampleGithubOrg, login: 123 }
      expect(() => validateGithubOrg(invalidData)).toThrow()
    })
  })
})
