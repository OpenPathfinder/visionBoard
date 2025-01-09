const { githubOrgMFA, softwareDesignTraining, adminRepoCreationOnly, owaspTraining } = require('../../src/checks/validators')
// @see: https://github.com/OpenPathfinder/visionBoard/issues/43
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
})

describe('softwareDesignTraining', () => {
  let trainings, check, projects
  beforeEach(() => {
    trainings = [
      {
        project_id: 1,
        training_date: new Date().toISOString()
      },
      {
        project_id: 2,
        training_date: new Date().toISOString()
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

  it('Should generate a passed result if the project has a software design training and it is up to date', () => {
    const analysis = softwareDesignTraining({ trainings, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'Software Design Training is up to date'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'Software Design Training is up to date'
        }
      ],
      tasks: []
    })
  })
  it('Should generate a failed result if the project has a software design training but it is out of date', () => {
    trainings[0].training_date = '2019-01-01'
    const analysis = softwareDesignTraining({ trainings, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Software Design Training is out of date',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'Software Design Training is out of date'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'Software Design Training is up to date'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Update Software Design Training',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })
  it('Should generate a failed result if the project does not have a software design training', () => {
    trainings = []
    const analysis = softwareDesignTraining({ trainings, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'No Software Design Training found',
          description: 'Check the details on https://example.com'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'No Software Design Training found',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'No Software Design Training found'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'No Software Design Training found'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Create a Software Design Training',
          description: 'Check the details on https://example.com'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Create a Software Design Training',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })
})

describe('owaspTraining', () => {
  let trainings, check, projects

  beforeEach(() => {
    trainings = [
      {
        project_id: 1,
        training_date: new Date().toISOString()
      },
      {
        project_id: 2,
        training_date: new Date().toISOString()
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

  it('Should generate a passed result if the project has a software design training and it is up to date', () => {
    const analysis = owaspTraining({ trainings, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'Owasp Top 10 Training is up to date'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'Owasp Top 10 Training is up to date'
        }
      ],
      tasks: []
    })
  })
  it('Should generate a failed result if the project has a software design training but it is out of date', () => {
    trainings[0].training_date = '2019-01-01'
    const analysis = owaspTraining({ trainings, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Owasp Top 10 Training is out of date',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'Owasp Top 10 Training is out of date'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'passed',
          rationale: 'Owasp Top 10 Training is up to date'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Update Owasp Top 10 Training',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })
  it('Should generate a failed result if the project does not have a software design training', () => {
    trainings = []
    const analysis = owaspTraining({ trainings, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'No Owasp Top 10 Training found',
          description: 'Check the details on https://example.com'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'No Owasp Top 10 Training found',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'No Owasp Top 10 Training found'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          status: 'failed',
          rationale: 'No Owasp Top 10 Training found'
        }
      ],
      tasks: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Create a Owasp Top 10 Training',
          description: 'Check the details on https://example.com'
        },
        {
          project_id: 2,
          compliance_check_id: 1,
          severity: 'critical',
          title: 'Create a Owasp Top 10 Training',
          description: 'Check the details on https://example.com'
        }
      ]
    })
  })
})

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
