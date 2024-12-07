const { validateGithubUrl, ensureGithubToken, groupArrayItemsByCriteria, getSeverityFromPriorityGroup } = require('../src/utils/index')

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

describe('groupArrayItemsByCriteria', () => {
  const groupByProject = groupArrayItemsByCriteria('project_id')

  it('should group array items by criteria', () => {
    const items = [
      { project_id: 1, name: 'item1' },
      { project_id: 1, name: 'item2' },
      { project_id: 2, name: 'item3' }
    ]
    const expected = [
      [
        { project_id: 1, name: 'item1' },
        { project_id: 1, name: 'item2' }
      ],
      [
        { project_id: 2, name: 'item3' }
      ]
    ]
    expect(groupByProject(items)).toEqual(expected)
  })
})

describe('getSeverityFromPriorityGroup', () => {
  it('should return the correct severity based on the priority group', () => {
    expect(getSeverityFromPriorityGroup('P0')).toBe('critical')
    expect(getSeverityFromPriorityGroup('P1')).toBe('critical')
    expect(getSeverityFromPriorityGroup('P2')).toBe('critical')
    expect(getSeverityFromPriorityGroup('P3')).toBe('high')
    expect(getSeverityFromPriorityGroup('P4')).toBe('high')
    expect(getSeverityFromPriorityGroup('P5')).toBe('medium')
    expect(getSeverityFromPriorityGroup('P6')).toBe('medium')
    expect(getSeverityFromPriorityGroup('P7')).toBe('medium')
    expect(getSeverityFromPriorityGroup('P8')).toBe('low')
    expect(getSeverityFromPriorityGroup('P20')).toBe('low')
    // Recommendations always have 'info' severity
    expect(getSeverityFromPriorityGroup('R1')).toBe('info')
    expect(getSeverityFromPriorityGroup('R11')).toBe('info')
  })
})
