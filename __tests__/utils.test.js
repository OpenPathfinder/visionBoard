const { validateGithubUrl, ensureGithubToken, groupArrayItemsByCriteria, getSeverityFromPriorityGroup, isDateWithinPolicy, redactSensitiveData } = require('../src/utils/index')

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

describe('isDateWithinPolicy', () => {
  it('should return true for date within 90 days', () => {
    const targetDate = new Date().toISOString()
    const policy = '90d'
    expect(isDateWithinPolicy(targetDate, policy)).toBe(true)
  })

  it('should return false for date outside 90 days', () => {
    const targetDate = new Date(new Date().setDate(new Date().getDate() - 91)).toISOString()
    const policy = '90d'
    expect(isDateWithinPolicy(targetDate, policy)).toBe(false)
  })

  it('should return true for date within 3 months', () => {
    const targetDate = new Date().toISOString()
    const policy = '3m'
    expect(isDateWithinPolicy(targetDate, policy)).toBe(true)
  })

  it('should return false for date outside 3 months', () => {
    const targetDate = new Date(new Date().setMonth(new Date().getMonth() - 4)).toISOString()
    const policy = '3m'
    expect(isDateWithinPolicy(targetDate, policy)).toBe(false)
  })

  it('should return true for date within 1 quarter', () => {
    const targetDate = new Date().toISOString()
    const policy = '1q'
    expect(isDateWithinPolicy(targetDate, policy)).toBe(true)
  })

  it('should throw an error for unsupported policy format', () => {
    const targetDate = new Date().toISOString()
    const policy = '10y' // Unsupported format
    expect(() => isDateWithinPolicy(targetDate, policy)).toThrow('Unsupported policy format')
  })

  it('should throw an error if expiration policy is not provided', () => {
    const targetDate = new Date().toISOString()
    expect(() => isDateWithinPolicy(targetDate)).toThrow('Policy is required')
  })

  it('should throw an error if the targetDate is not provided', () => {
    const policy = '3m'
    expect(() => isDateWithinPolicy(undefined, policy)).toThrow('Target date is required')
  })
})

describe('redactSensitiveData', () => {
  it('should redact sensitive data from a string', () => {
    const input = 'This has a token: ghp_234 and other information'
    const expected = 'This has a token: [REDACTED] and other information'
    expect(redactSensitiveData(input)).toBe(expected)
  })
  it('Should return the same string if no sensitive data is found', () => {
    const input = 'This is a normal string'
    expect(redactSensitiveData(input)).toBe(input)
  })
})
