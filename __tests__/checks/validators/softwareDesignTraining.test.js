const { softwareDesignTraining } = require('../../../src/checks/validators')

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
