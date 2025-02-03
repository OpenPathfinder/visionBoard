const { noSensitiveInfoInRepositories } = require('../../../src/checks/validators')

describe('noSensitiveInfoInRepositories', () => {
  let data, check, projects
  beforeEach(() => {
    data = [
      {
        project_id: 1,
        secret_scanning_enabled_for_new_repositories: true,
        github_organization_id: 1,
        login: 'org1',
        repositories: [
          {
            id: 1,
            secret_scanning_status: 'enabled',
            name: 'test',
            full_name: 'org1/test'
          },
          {
            id: 2,
            secret_scanning_status: 'enabled',
            name: 'discussions',
            full_name: 'org1/discussions'
          }
        ]
      }, {
        project_id: 1,
        secret_scanning_enabled_for_new_repositories: true,
        github_organization_id: 2,
        login: 'org2',
        repositories: [
          {
            id: 3,
            secret_scanning_status: 'enabled',
            name: '.github',
            full_name: 'org2/.github'
          }
        ]
      }, {
        project_id: 2,
        secret_scanning_enabled_for_new_repositories: true,
        github_organization_id: 3,
        login: 'org3',
        repositories: [
          {
            id: 4,
            secret_scanning_status: 'enabled',
            name: 'support',
            full_name: 'org3/support'
          }
        ]
      }]

    check = {
      id: 1,
      default_priority_group: 'P2',
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

  it('Should generate a passed result if all organizations and repositories have secret enabled', () => {
    const analysis = noSensitiveInfoInRepositories({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'The organizations(s) and repositories have secret scanning enabled'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories have secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('should generate a failed result if some organizations do not have secret scanning enabled for new repositories, but existing repositories do have it enabled', () => {
    data[0].secret_scanning_enabled_for_new_repositories = false
    // IMPORTANT: If one organization fails, the whole project fails no matter how other organizations are in the project
    data[1].secret_scanning_enabled_for_new_repositories = null

    const analysis = noSensitiveInfoInRepositories({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'The organization(s) (org1) has not enabled secret scanning by default. All repositories have the secret scanner enabled',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'The organization(s) (org1) has not enabled secret scanning by default. All repositories have the secret scanner enabled'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories have secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Enable secret scanning for new repositories for the organization(s) (org1)',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('should generate a failed result if some organizations and repositories do not have secret scanning enabled for new repositories', () => {
    data[0].secret_scanning_enabled_for_new_repositories = false
    data[0].repositories[0].secret_scanning_status = 'disabled'
    data[1].secret_scanning_enabled_for_new_repositories = false
    data[1].repositories[0].secret_scanning_status = 'disabled'

    const analysis = noSensitiveInfoInRepositories({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'The organization(s) (org1,org2) has not enabled secret scanning by default. 2 (66.7%) repositories do not have the secret scanner enabled',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'The organization(s) (org1,org2) has not enabled secret scanning by default. 2 (66.7%) repositories do not have the secret scanner enabled'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories have secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Enable secret scanning for new repositories for the organization(s) (org1,org2) and 2 (66.7%) repositories',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('should generate a failed result if some and repositories do not have secret scanning enabled for new repositories', () => {
    data[1].repositories[0].secret_scanning_status = 'disabled'

    const analysis = noSensitiveInfoInRepositories({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'The organization(s) has secret scanning for new repositories enabled. 1 (33.3%) repositories do not have the secret scanner enabled',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'The organization(s) has secret scanning for new repositories enabled. 1 (33.3%) repositories do not have the secret scanner enabled'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories have secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Enable secret scanning for 1 (33.3%) repositories (org2/.github) in GitHub',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('should generate an unknown result if some organizations have unknown secret enabled, but existing repositories do have it enabled', () => {
    data[0].secret_scanning_enabled_for_new_repositories = null
    const analysis = noSensitiveInfoInRepositories({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'unknown',
          rationale: 'It was not possible to confirm if the organization(s) has enabled secret scanning for new repositories in the following (org1) organization(s)'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories have secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('should generate an unknown result if all organizations have secret enabled, but some repositories have unknown secret enabled', () => {
    data[0].repositories[0].secret_scanning_status = null

    const analysis = noSensitiveInfoInRepositories({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'unknown',
          rationale: 'It was not possible to confirm if some repositories have not enabled secret scanning'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories have secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('should generate an unknown result if some organizations and some repositories have unknown secret enabled', () => {
    data[0].repositories[0].secret_scanning_status = null
    data[0].secret_scanning_enabled_for_new_repositories = null

    const analysis = noSensitiveInfoInRepositories({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'unknown',
          rationale: 'It was not possible to confirm if some organizations and repositories have secret scanning enabled'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories have secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('should generate an failed result if some organizations have unknown secret scanning and some repositories don\'t have secret enabled', () => {
    data[0].repositories[0].secret_scanning_status = 'disabled'
    data[0].secret_scanning_enabled_for_new_repositories = null

    const analysis = noSensitiveInfoInRepositories({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          compliance_check_id: 1,
          description: 'Check the details on https://example.com',
          project_id: 1,
          severity: 'critical',
          title: 'It was not possible to confirm if the organization(s) has enabled secret scanning for new repositories in the following (org1) organization(s). 1 (33.3%) repositories do not have the secret scanner enabled'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'It was not possible to confirm if the organization(s) has enabled secret scanning for new repositories in the following (org1) organization(s). 1 (33.3%) repositories do not have the secret scanner enabled'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories have secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: [
        {
          compliance_check_id: 1,
          description: 'Check the details on https://example.com',
          project_id: 1,
          severity: 'critical',
          title: 'Enable secret scanning for 1 (33.3%) repositories (org1/test) in GitHub'
        }
      ]
    })
  })

  it('should generate an failed result if some organizations don\'t have secret scanning and some repositories have unknown secret enabled', () => {
    data[1].repositories[0].secret_scanning_status = null
    data[0].secret_scanning_enabled_for_new_repositories = false

    const analysis = noSensitiveInfoInRepositories({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          compliance_check_id: 1,
          description: 'Check the details on https://example.com',
          project_id: 1,
          severity: 'critical',
          title: 'The organization(s) (org1) has not enabled secret scanning by default. It was not possible to confirm if some repositories have not enabled secret scanning'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'The organization(s) (org1) has not enabled secret scanning by default. It was not possible to confirm if some repositories have not enabled secret scanning'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories have secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: [
        {
          compliance_check_id: 1,
          description: 'Check the details on https://example.com',
          project_id: 1,
          severity: 'critical',
          title: 'Enable secret scanning for new repositories for the organization(s) (org1)'
        }
      ]
    })
  })
})
