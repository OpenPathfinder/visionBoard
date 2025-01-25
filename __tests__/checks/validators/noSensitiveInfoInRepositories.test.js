const { noSensitiveInfoInRepositories } = require('../../../src/checks/validators')

describe('noSensitiveInfoInRepositories', () => {
  let organizations, check, projects
  beforeEach(() => {
    organizations = [
      {
        id: 1,
        project_id: 1,
        login: 'org1',
        secret_scanning_enabled_for_new_repositories: true,
        secret_scanning_status: 'enabled',
        name: 'test',
        github_organization_id: 1
      },
      {
        id: 1,
        project_id: 1,
        login: 'org1',
        secret_scanning_enabled_for_new_repositories: true,
        secret_scanning_status: 'enabled',
        name: 'discussions',
        github_organization_id: 1
      },
      {
        id: 2,
        project_id: 1,
        login: 'org2',
        secret_scanning_enabled_for_new_repositories: true,
        secret_scanning_status: 'enabled',
        name: '.github',
        github_organization_id: 2
      },
      {
        id: 3,
        project_id: 2,
        login: 'org3',
        secret_scanning_enabled_for_new_repositories: true,
        secret_scanning_status: 'enabled',
        name: 'support',
        github_organization_id: 3
      }
    ]

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

  it('Should generate a passed result if all organizations and repositories have secrect enabled', () => {
    const analysis = noSensitiveInfoInRepositories({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'The organizations(s) and repositories has secret scanning enabled'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories has secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('should generate a failed result if some organizations do not have secret scanning enabled for new repositories, but existing repositories do have it enabled', () => {
    organizations[0].secret_scanning_enabled_for_new_repositories = false
    // IMPORTANT: If one organization fails, the whole project fails no matter how other organizations are in the project
    organizations[1].secret_scanning_enabled_for_new_repositories = null

    const analysis = noSensitiveInfoInRepositories({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'The organization(s) has not enabled secret scanning by default. All repositories have the secret scanner enabled',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'The organization(s) has not enabled secret scanning by default. All repositories have the secret scanner enabled'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories has secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Enable secret scanning for new repositories for the organization(s)',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('should generate a failed result if some organizations and repositories do not have secret scanning enabled for new repositories', () => {
    organizations[0].secret_scanning_enabled_for_new_repositories = false
    organizations[1].secret_scanning_enabled_for_new_repositories = false
    organizations[1].secret_scanning_status = 'disabled'
    organizations[0].secret_scanning_status = 'disabled'

    const analysis = noSensitiveInfoInRepositories({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'The organization(s) has not enabled secret scanning by default. 2 repositories do not have the secret scanner enabled',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'The organization(s) has not enabled secret scanning by default. 2 repositories do not have the secret scanner enabled'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories has secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          // TODO: Add org name and repos names
          title: 'Enable secret scanning for new repositories for the organization(s) and the repositories',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('should generate a failed result if some and repositories do not have secret scanning enabled for new repositories', () => {
    organizations[2].secret_scanning_status = 'disabled'

    const analysis = noSensitiveInfoInRepositories({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'The organization(s) has secret scanning for new repositories enabled. 1 repositories do not have the secret scanner enabled',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'The organization(s) has secret scanning for new repositories enabled. 1 repositories do not have the secret scanner enabled'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories has secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Enable secret scanning for the repositories in the organization ()',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('should generate an unknown result if some organizations have unknown secret ennabled, but existing repositories do have it enabled', () => {
    organizations[0].secret_scanning_enabled_for_new_repositories = null
    const analysis = noSensitiveInfoInRepositories({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'unknown',
          rationale: 'It was not possible to confirm if the organization(s) has enabled secret scanning for new repositories in the following () organization(s)'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories has secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('should generate an unknown result if all organizations have secret ennabled, but some repositories have unknow secret ennabled', () => {
    organizations[0].secret_scanning_status = null

    const analysis = noSensitiveInfoInRepositories({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'unknown',
          rationale: 'It was not possible to confirm if some repositories has not enabled secret scanning'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories has secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('should generate an unknown result if some organizations and some repositories have unknow secret ennabled', () => {
    organizations[0].secret_scanning_status = null
    organizations[1].secret_scanning_enabled_for_new_repositories = null

    const analysis = noSensitiveInfoInRepositories({ organizations, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'unknown',
          rationale: 'It was not possible to confirm if some organizations and repositories has not enabled secret scanning'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'The organizations(s) and repositories has secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })
})
