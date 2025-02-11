const { owaspTop10Training } = require('../../../src/checks/validators')

describe('owaspTop10Training', () => {
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

  it('Should generate a passed result if the project has a OWASP TOP10 training and it is up to date', () => {
    const analysis = owaspTop10Training({ trainings, check, projects })
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
  it('Should generate a failed result if the project has a OWASP TOP10 training but it is out of date', () => {
    trainings[0].training_date = '2019-01-01'
    const analysis = owaspTop10Training({ trainings, check, projects })
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
  it('Should generate a failed result if the project does not have a OWASP TOP10 training', () => {
    trainings = []
    const analysis = owaspTop10Training({ trainings, check, projects })
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
