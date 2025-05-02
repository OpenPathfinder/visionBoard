const {
  sampleGithubOrg,
  sampleGithubListOrgRepos,
  sampleGithubRepository,
  sampleOSSFScorecardResult,
  sampleBulkImportFileContent,
  sampleProjectData,
  sampleIndexData
} = require('../__fixtures__')
const {
  validateGithubOrg,
  validateGithubListOrgRepos,
  validateGithubRepository,
  validateOSSFResult,
  validateBulkImport,
  validateProjectData,
  validateIndexData
} = require('../src/schemas')

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
  describe('validateOSSFResult', () => {
    test('Should not throw an error with valid data', () => {
      expect(() => validateOSSFResult(sampleOSSFScorecardResult)).not.toThrow()
    })

    test('Should not throw an error with additional data', () => {
      const additionalData = { ...sampleOSSFScorecardResult, additionalKey: 'value' }
      expect(() => validateOSSFResult(additionalData)).not.toThrow()
    })

    test('Should throw an error with invalid data', () => {
      const invalidData = { ...sampleOSSFScorecardResult, score: '123' }
      expect(() => validateOSSFResult(invalidData)).toThrow()
    })
  })
  describe('validateBulkImport', () => {
    test('Should not throw an error with valid data', () => {
      expect(() => validateBulkImport(sampleBulkImportFileContent)).not.toThrow()
    })

    test('Should throw an error with invalid data', () => {
      const invalidData = [
        ...sampleBulkImportFileContent,
        { ...sampleBulkImportFileContent[0], type: 'invalidType' }
      ]
      expect(() => validateBulkImport(invalidData)).toThrow()
    })
  })

  describe('validateProjectData', () => {
    test('Should not throw an error with valid data', () => {
      expect(() => validateProjectData(sampleProjectData)).not.toThrow()
    })

    test('Should not throw an error with additional data', () => {
      // Create a valid project data object with additional properties
      const validProjectDataWithAdditionalProps = {
        ...sampleProjectData,
        project: {
          ...sampleProjectData.project,
          additionalProperty: 'value'
        },
        additionalProperty: 'value'
      }

      expect(() => validateProjectData(validProjectDataWithAdditionalProps)).not.toThrow()
    })

    test('Should throw an error with invalid data', () => {
      // Create an invalid project data object (missing required field)
      const invalidProjectData = {
        project: {
          // Missing id field
          name: 'Test Project'
        },
        checks: [],
        results: [],
        tasks: [],
        alerts: [],
        githubOrgs: [],
        githubRepos: [],
        ossfScorecardResults: []
      }

      expect(() => validateProjectData(invalidProjectData)).toThrow('Error when validating project data')
    })

    test('Should throw an error with invalid nested data', () => {
      // Create an invalid project data object (invalid field type)
      const invalidProjectData = {
        project: {
          id: 1,
          name: 'Test Project'
        },
        checks: [],
        results: [
          {
            id: 1,
            project_id: 1,
            name: 'Test result',
            score: 'not-a-number', // Should be a number
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-02T00:00:00Z'
          }
        ],
        tasks: [],
        alerts: [],
        githubOrgs: [],
        githubRepos: [],
        ossfScorecardResults: []
      }

      expect(() => validateProjectData(invalidProjectData)).toThrow('Error when validating project data')
    })

    test('Should throw an error when required fields are missing', () => {
      // Missing required fields in the data object
      const missingFieldsData = {
        // Missing project field
        checks: [],
        results: [],
        tasks: [],
        alerts: [],
        githubOrgs: [],
        githubRepos: [],
        ossfScorecardResults: []
      }

      expect(() => validateProjectData(missingFieldsData)).toThrow('Error when validating project data')
    })
  })

  describe('validateIndexData', () => {
    test('Should not throw an error with valid data', () => {
      expect(() => validateIndexData(sampleIndexData)).not.toThrow()
    })

    test('Should not throw an error with additional data', () => {
      // Create a valid index data object with additional properties
      const validIndexDataWithAdditionalProps = {
        ...sampleIndexData,
        projects: [
          {
            ...sampleIndexData.projects[0],
            additionalProperty: 'value'
          }
        ],
        additionalProperty: 'value'
      }

      expect(() => validateIndexData(validIndexDataWithAdditionalProps)).not.toThrow()
    })

    test('Should throw an error with invalid data', () => {
      // Create an invalid index data object (missing required field)
      const invalidIndexData = {
        projects: [
          {
            id: 1,
            // Missing name field
            description: 'A test project'
          }
        ],
        checklists: [],
        checks: []
      }

      expect(() => validateIndexData(invalidIndexData)).toThrow('Error when validating index data')
    })

    test('Should throw an error with invalid nested data', () => {
      // Create an invalid index data object (invalid field type)
      const invalidIndexData = {
        projects: [],
        checklists: [
          {
            id: '1', // Should be a number
            name: 'Test Checklist',
            type: 'security',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-02T00:00:00Z'
          }
        ],
        checks: []
      }

      expect(() => validateIndexData(invalidIndexData)).toThrow('Error when validating index data')
    })

    test('Should throw an error when required fields are missing', () => {
      // Missing required fields in the data object
      const missingFieldsData = {
        // Missing projects field
        checklists: []
        // Missing checks field
      }

      expect(() => validateIndexData(missingFieldsData)).toThrow('Error when validating index data')
    })
  })
})
