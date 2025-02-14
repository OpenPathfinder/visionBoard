const validators = require('../../../src/checks/validators')

describe('Generic Project Policy Validators', () => {
  let check, projects

  beforeEach(() => {
    projects = [
      {
        id: 1,
        has_defineFunctionalRoles_policy: true
      }, {
        id: 2,
        has_defineFunctionalRoles_policy: true
      }]

    check = {
      id: 1,
      default_priority_group: 'P2',
      details_url: 'https://example.com'
    }
  })

  // @TODO: ensure that the genericProjectPolicyValidator is used in the validators
  it('Should include all the generic validators', () => {
    expect(validators).toHaveProperty('defineFunctionalRoles')
    expect(validators).toHaveProperty('orgToolingMFA')
    expect(validators).toHaveProperty('softwareArchitectureDocs')
    expect(validators).toHaveProperty('MFAImpersonationDefense')
    expect(validators).toHaveProperty('includeCVEInReleaseNotes')
    expect(validators).toHaveProperty('assignCVEForKnownVulns')
    expect(validators).toHaveProperty('incidentResponsePlan')
    expect(validators).toHaveProperty('regressionTestsForVulns')
    expect(validators).toHaveProperty('vulnResponse14Days')
    expect(validators).toHaveProperty('useCVDToolForVulns')
    expect(validators).toHaveProperty('securityMdMeetsOpenJSCVD')
    expect(validators).toHaveProperty('consistentBuildProcessDocs')
    expect(validators).toHaveProperty('machineReadableDependencies')
    expect(validators).toHaveProperty('identifyModifiedDependencies')
    expect(validators).toHaveProperty('ciAndCdPipelineAsCode')
    expect(validators).toHaveProperty('npmOrgMFA')
    expect(validators).toHaveProperty('npmPublicationMFA')
    expect(validators).toHaveProperty('upgradePathDocs')
  })

  it('Should generate a passed result if all the projects subscribes the policy', () => {
    const analysis = validators.defineFunctionalRoles({ check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'The project subscribes to the defineFunctionalRoles policy'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The project subscribes to the defineFunctionalRoles policy',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('Should generate a failed result if any project does not subscribes the policy', () => {
    projects[0].has_defineFunctionalRoles_policy = false
    const analysis = validators.defineFunctionalRoles({ check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'The project does not subscribe to the defineFunctionalRoles policy',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'The project does not subscribe to the defineFunctionalRoles policy'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The project subscribes to the defineFunctionalRoles policy',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Subscribe to the defineFunctionalRoles policy',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('Should generate an unknown result if any project has an unknown policy status', () => {
    projects[0].has_defineFunctionalRoles_policy = null
    const analysis = validators.defineFunctionalRoles({ check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'unknown',
          rationale: 'The project has the policy defineFunctionalRoles with an unknown status'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The project subscribes to the defineFunctionalRoles policy',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })
})
