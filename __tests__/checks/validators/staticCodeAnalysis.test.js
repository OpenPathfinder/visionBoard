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
            full_name: 'org1/test'
          },
          {
            id: 2,
            name: 'discussions',
            full_name: 'org1/discussions'
          }
        ],
        ossf_results: [
          {
            sast_score: 10,
            github_repository_id: 1
          },
          {
            sast_score: 10,
            github_repository_id: 2
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
            full_name: 'org2/.github'
          }
        ],
        ossf_results: [
          {
            sast_score: 10,
            github_repository_id: 3
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
            full_name: 'org3/support'
          }
        ],
        ossf_results: [
          {
            sast_score: 10,
            github_repository_id: 4
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

  it.todo('Should generate a passed result if all repositories has a high static code analysis score')
  it.todo('Should generate a pass result if not have public repositories')
  it.todo('Should generate a failed result if some repositories do not have static code analysis')
  it.todo('Should generate a failed result if somre repisotiores have low static code analysis score')
  it.todo('Should generate a failed result if some repositories have a low static code analysis score and some repositories have unkwon result')
  it.todo('Should generate an unknown result if not have ossf results')
  it.todo('Should generate an unknown result if some have repositories have unkown ossf results but other repositories have a high static code analysis score')
  it.todo('Should generate an unknown result if some repositories have unknown static code analysis')
})
