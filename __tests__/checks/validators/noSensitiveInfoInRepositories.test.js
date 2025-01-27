const { noSensitiveInfoInRepositories } = require('../../../src/checks/validators')

describe('noSensitiveInfoInRepositories', () => {
  let repositories, check, projects
  beforeEach(() => {
    repositories = [
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
    const analysis = noSensitiveInfoInRepositories({ repositories, check, projects })
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
    repositories[0].secret_scanning_enabled_for_new_repositories = false
    // IMPORTANT: If one organization fails, the whole project fails no matter how other organizations are in the project
    repositories[1].secret_scanning_enabled_for_new_repositories = null

    const analysis = noSensitiveInfoInRepositories({ repositories, check, projects })
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
          title: 'Enable secret scanning for new repositories for the organization(s) (org1)',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('should generate a failed result if some organizations and repositories do not have secret scanning enabled for new repositories', () => {
    repositories[0].secret_scanning_enabled_for_new_repositories = false
    repositories[2].secret_scanning_enabled_for_new_repositories = false
    repositories[2].secret_scanning_status = 'disabled'
    repositories[0].secret_scanning_status = 'disabled'

    const analysis = noSensitiveInfoInRepositories({ repositories, check, projects })
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
          title: 'Enable secret scanning for new repositories for the organization(s) (org1,org2) and 2 (66.7%) repositories',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('should generate a failed result if some and repositories do not have secret scanning enabled for new repositories', () => {
    repositories[2].secret_scanning_status = 'disabled'

    const analysis = noSensitiveInfoInRepositories({ repositories, check, projects })
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
          title: 'Enable secret scanning for 1 (33.3%) repositories in the organization(s) (org2)',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })

  it('should generate an unknown result if some organizations have unknown secret ennabled, but existing repositories do have it enabled', () => {
    repositories[0].secret_scanning_enabled_for_new_repositories = null
    const analysis = noSensitiveInfoInRepositories({ repositories, check, projects })
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
          rationale: 'The organizations(s) and repositories has secret scanning enabled',
          severity: 'critical',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('should generate an unknown result if all organizations have secret ennabled, but some repositories have unknow secret ennabled', () => {
    repositories[0].secret_scanning_status = null

    const analysis = noSensitiveInfoInRepositories({ repositories, check, projects })
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
    repositories[0].secret_scanning_status = null
    repositories[1].secret_scanning_enabled_for_new_repositories = null

    const analysis = noSensitiveInfoInRepositories({ repositories, check, projects })
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

  it('should generate an failed result if some organizations have unknow secret scanning and some repositories don\'t have secret ennabled', () => {
    repositories[0].secret_scanning_status = 'disabled'
    repositories[1].secret_scanning_enabled_for_new_repositories = null

    const analysis = noSensitiveInfoInRepositories({ repositories, check, projects })
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
          rationale: 'The organizations(s) and repositories has secret scanning enabled',
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
          title: 'Enable secret scanning for 1 (33.3%) repositories in the organization(s) (org1)'
        }
      ]
    })
  })

  it('should generate an failed result if some organizations don\'t have secret scanning and some repositories have unknow secret ennabled', () => {
    repositories[0].secret_scanning_status = null
    repositories[1].secret_scanning_enabled_for_new_repositories = false

    const analysis = noSensitiveInfoInRepositories({ repositories, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          compliance_check_id: 1,
          description: 'Check the details on https://example.com',
          project_id: 1,
          severity: 'critical',
          title: 'The organization(s) (org1) has not enabled secret scanning by default. It was not possible to confirm if some repositories has not enabled secret scanning'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'The organization(s) (org1) has not enabled secret scanning by default. It was not possible to confirm if some repositories has not enabled secret scanning'
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
