const { sampleGithubOrg, sampleGithubListOrgRepos, sampleGithubRepository } = require('../__fixtures__')
const { validateGithubOrg, validateGithubListOrgRepos, validateGithubRepository } = require('../src/schemas')

describe('schemas', () => {
  describe('validateGithubOrg', () => {
    test('Should not throw an error with valid data', () => {
      expect(() => validateGithubOrg(sampleGithubOrg)).not.toThrow()
    })

    test('Should not throw an error with additional data', () => {
      const additionalData = { ...sampleGithubOrg, additionalKey: 'value' }
      expect(() => validateGithubOrg(additionalData)).not.toThrow()
    })

    test('Should throw an error with invalid data', () => {
      const invalidData = { ...sampleGithubOrg, login: 123 }
      expect(() => validateGithubOrg(invalidData)).toThrow()
    })
  })
  describe('validateGithubListOrgRepos', () => {
    test('Should not throw an error with valid data', () => {
      expect(() => validateGithubListOrgRepos(sampleGithubListOrgRepos)).not.toThrow()
    })

    test('Should not throw an error with additional data', () => {
      const additionalData = [
        ...sampleGithubListOrgRepos,
        { ...sampleGithubListOrgRepos[0], additionalKey: 'value' }
      ]
      expect(() => validateGithubListOrgRepos(additionalData)).not.toThrow()
    })

    test('Should throw an error with invalid data', () => {
      const invalidData = [
        ...sampleGithubListOrgRepos,
        { ...sampleGithubListOrgRepos[0], id: '123' }
      ]
      expect(() => validateGithubListOrgRepos(invalidData)).toThrow()
    })
  })
  describe('validateGithubRepository', () => {
    test('Should not throw an error with valid data', () => {
      expect(() => validateGithubRepository(sampleGithubRepository)).not.toThrow()
    })

    test('Should not throw an error with additional data', () => {
      const additionalData = { ...sampleGithubRepository, additionalKey: 'value' }
      expect(() => validateGithubRepository(additionalData)).not.toThrow()
    })

    test('Should throw an error with invalid data', () => {
      const invalidData = { ...sampleGithubRepository, id: '123' }
      expect(() => validateGithubRepository(invalidData)).toThrow()
    })
  })
})
