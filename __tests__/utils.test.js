const { validateGithubUrl, ensureGithubToken } = require('../src/utils/index')

describe('ensureGithubToken', () => {
  let originalGithubToken

  beforeAll(() => {
    originalGithubToken = process.env.GITHUB_TOKEN
  })

  afterAll(() => {
    process.env.GITHUB_TOKEN = originalGithubToken
  })

  it('should throw an error if GITHUB_TOKEN is required', () => {
    delete process.env.GITHUB_TOKEN
    expect(() => ensureGithubToken()).toThrow('GITHUB_TOKEN is required')
  })

  it('should not throw an error if GITHUB_TOKEN is set', () => {
    process.env.GITHUB_TOKEN = 'test-token'
    expect(() => ensureGithubToken()).not.toThrow()
  })
})

describe('validateGithubUrl', () => {
  it('should return true for a valid GitHub URL', () => {
    const url = 'https://github.com/user/repo'
    expect(validateGithubUrl(url)).toBe(true)
  })

  it('should return false for a URL without https protocol', () => {
    const url = 'http://github.com/user/repo'
    expect(validateGithubUrl(url)).toBe(false)
  })

  it('should return false for a URL not containing github.com', () => {
    const url = 'https://example.com/user/repo'
    expect(validateGithubUrl(url)).toBe(false)
  })

  it('should return false for an invalid URL', () => {
    const url = 'not-a-valid-url'
    expect(validateGithubUrl(url)).toBe(false)
  })
})
