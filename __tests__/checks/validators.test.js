const { githubOrgMFA } = require('../../src/checks/validators')
// @see: https://github.com/secure-dashboards/openjs-foundation-dashboard/issues/43
describe('githubOrgMFA', () => {
  let organizations, check, projects
  beforeEach(() => {
    organizations = [
      {
        project_id: 1,
        login: 'org1',
        two_factor_requirement_enabled: true
      },
      {
        project_id: 1,
        login: 'org2',
        two_factor_requirement_enabled: true
      },
      {
        project_id: 2,
        login: 'org3',
        two_factor_requirement_enabled: true
      }
    ]

    check = {
      id: 1,
      priority_group: 'P1',
      details_url: 'https://example.com',
      level_incubating_status: 'expected',
      level_active_status: 'expected',
      level_retiring_status: 'expected'
    }

    projects = [
      {
        id: 1,
        category: 'impact'
      },
      {
        id: 2,
        category: 'at-large'
      }
    ]
  })
  it('Should generate a passed result if all organizations have 2FA enabled', () => {
    const analysis = githubOrgMFA({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'The organization(s) have 2FA enabled'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organization(s) have 2FA enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('should generate a failed result if some organizations do not have 2FA enabled', () => {
    organizations[0].two_factor_requirement_enabled = false
    // IMPORTANT: If one organization fails, the whole project fails no matter how other organizations are in the project
    organizations[1].two_factor_requirement_enabled = null

    const analysis = githubOrgMFA({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'The organization(s) (org1) do not have 2FA enabled',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'The organization(s) (org1) do not have 2FA enabled'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'The organization(s) have 2FA enabled'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Enable 2FA for the organization(s) (org1)',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('should generate an unknown result if some organizations have unknown 2FA status', () => {
    organizations[1].two_factor_requirement_enabled = null
    const analysis = githubOrgMFA({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'unknown',
          rationale: 'The organization(s) (org2) have 2FA status unknown'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'The organization(s) have 2FA enabled'
        }
      ],
      tasks: []
    })
  })

  it('Should skip the check if it is not in scope for the project category', () => {
    check.level_active_status = 'n/a'
    check.level_incubating_status = 'n/a'
    check.level_retiring_status = 'n/a'
    const analysis = githubOrgMFA({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [],
      tasks: []
    })
  })
})
