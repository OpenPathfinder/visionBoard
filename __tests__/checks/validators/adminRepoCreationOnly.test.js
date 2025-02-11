const { adminRepoCreationOnly } = require('../../../src/checks/validators')

describe('adminRepoCreationOnly', () => {
  let organizations, check, projects
  beforeEach(() => {
    organizations = [
      {
        project_id: 1,
        login: 'org1',
        members_can_create_public_repositories: false
      },
      {
        project_id: 1,
        login: 'org2',
        members_can_create_public_repositories: false
      },
      {
        project_id: 2,
        login: 'org3',
        members_can_create_public_repositories: false
      }
    ]

    check = {
      id: 1,
      default_priority_group: 'P1',
      details_url: 'https://example.com'
    }

    projects = [
      {
        id: 1
      },
      {
        id: 2
      }
    ]
  })
  it('Should generate a passed result if only admins can create public repos in all the organizations', () => {
    const analysis = adminRepoCreationOnly({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'Only Admins can create public repositories in the organization(s)'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'Only Admins can create public repositories in the organization(s)',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('should generate a failed result if some organizations have mixed permissions', () => {
    organizations[0].members_can_create_public_repositories = true
    // IMPORTANT: If one organization fails, the whole project fails no matter how other organizations are in the project
    organizations[1].members_can_create_public_repositories = null

    const analysis = adminRepoCreationOnly({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Not Only Admins can create public repositories in the following (org1) organization(s)',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'Not Only Admins can create public repositories in the following (org1) organization(s)'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'Only Admins can create public repositories in the organization(s)'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Limit public repo creation to admins for the following (org1) organization(s)',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('should generate an unknown result if some organizations have unknown permissions', () => {
    organizations[1].members_can_create_public_repositories = null
    const analysis = adminRepoCreationOnly({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'unknown',
          rationale: 'It was not possible to confirm if only admins can create public repositories in the following (org2) organization(s)'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'Only Admins can create public repositories in the organization(s)'
        }
      ],
      tasks: []
    })
  })
})
