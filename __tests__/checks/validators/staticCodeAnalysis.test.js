const { staticCodeAnalysis } = require('../../../src/checks/validators')

describe('staticCodeAnalysis', () => {
  let data, check, projects
  beforeEach(() => {
    data = [
      {
        project_id: 1,
        github_organization_id: 1,
        login: 'org1',
        repositories: [
          {
            id: 1,
            name: 'test',
            full_name: 'org1/test',
            ossf_results: {
              sast_score: 10
            }
          },
          {
            id: 2,
            name: 'discussions',
            full_name: 'org1/discussions',
            ossf_results: {
              sast_score: 10
            }
          }
        ]
      }, {
        project_id: 1,
        github_organization_id: 2,
        login: 'org2',
        repositories: [
          {
            id: 3,
            name: '.github',
            full_name: 'org2/.github',
            ossf_results: {
              sast_score: 10
            }
          }
        ]
      }, {
        project_id: 2,
        github_organization_id: 3,
        login: 'org3',
        repositories: [
          {
            id: 4,
            name: 'support',
            full_name: 'org3/support',
            ossf_results: {
              sast_score: 10
            }
          }
        ]
      }]

    check = {
      id: 1,
      default_priority_group: 'P6',
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

  it('Should generate a passed result if all repositories has a high static code analysis score', () => {
    const analysis = staticCodeAnalysis({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'medium',
          status: 'passed',
          rationale: 'All repositories in all organizations have a static code analysis tool'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'All repositories in all organizations have a static code analysis tool',
          severity: 'medium',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it.todo('Should generate a pass result if not have public repositories in some organizations')
  it.todo('Should generate a pass result if not have public repositories in all the organizations')

  it('Should generate a failed result if some repositories have low static code analysis score', () => {
    data[0].repositories[0].ossf_results.sast_score = 0
    data[0].repositories[1].ossf_results.sast_score = null
    data[1].repositories[0].ossf_results.sast_score = 0

    const analysis = staticCodeAnalysis({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'medium',
          title: '3 (66.7%) repositories in org1, org2 organizations do not have a static code analysis tool',
          description: 'Check the details on https://example.com'
        }
      ],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'medium',
          status: 'passed',
          rationale: '3 (66.7%) repositories in org1, org2 organizations do not have a static code analysis tool'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'All repositories in all organizations have a static code analysis tool',
          severity: 'medium',
          status: 'passed'
        }
      ],
      tasks: [
        {
          compliance_check_id: 1,
          description: 'Check the details on https://example.com',
          project_id: 1,
          severity: 'medium',
          title: 'Add a code analysis tool for 2 (66.7%) repositories (org1/test, org2/.github)'
        }
      ]
    })
  })

  it('Should generate an unknown result if not have ossf results', () => {
    data[0].repositories[0].ossf_results = null
    data[0].repositories[1].ossf_results = null
    data[1].repositories[0].ossf_results = null
    data[2].repositories[0].ossf_results = null

    const analysis = staticCodeAnalysis({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'medium',
          status: 'unknown',
          rationale: 'No results have been generated from the OSSF Scorecard'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'All repositories in all organizations have a static code analysis tool',
          severity: 'medium',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })

  it('Should generate an unknown result if some have repositories have unkown ossf results but other repositories have a high static code analysis score', () => {
    data[0].repositories[1].ossf_results = undefined

    const analysis = staticCodeAnalysis({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'medium',
          status: 'unknown',
          rationale: '1 (33.3%) repositories have not generated results from the OSSF Scorecard'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: 'All repositories in all organizations have a static code analysis tool',
          severity: 'medium',
          status: 'passed'
        }
      ],
      tasks: []
    })
  })
  it('Should generate an unknown result if some repositories have unknown static code analysis', () => {
    data[2].repositories[0].ossf_results.sast_score = null

    const analysis = staticCodeAnalysis({ data, check, projects })
    expect(analysis).toEqual({
      alerts: [],
      results: [
        {
          project_id: 1,
          compliance_check_id: 1,
          severity: 'medium',
          status: 'passed',
          rationale: 'All repositories in all organizations have a static code analysis tool'
        },
        {
          compliance_check_id: 1,
          project_id: 2,
          rationale: '1 (100%) repositories could not be determined to have a code analysis tool',
          severity: 'medium',
          status: 'unknown'
        }
      ],
      tasks: []
    })
  })
})
