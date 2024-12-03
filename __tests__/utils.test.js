const { validateGithubUrl } = require('../src/utils/index')

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
