const { github, ossf } = require('../src/providers')
const {
  sampleGithubOrg,
  sampleGithubRepository,
  sampleOSSFScorecardResult,
  sampleGithubListOrgRepos
} = require('../__fixtures__')
const nock = require('nock')

// Create a larger sample data set for pagination testing
const largeSampleGithubListOrgRepos = Array.from({ length: 150 }, (_, i) => ({
  ...sampleGithubListOrgRepos[0],
  id: i + 1,
  name: `repo-${i + 1}`,
  full_name: `org/repo-${i + 1}`
}))

describe('GitHub Provider', () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'github_pat_mock_token'
    nock.disableNetConnect()
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  describe('fetchOrgByLogin', () => {
    it.each([undefined, null, ''])('Should throw when no login are provided', async (login) => {
      await expect(github.fetchOrgByLogin(login)).rejects.toThrow('Organization name is required')
    })

    it('Should fetch organization by login', async () => {
      nock('https://api.github.com')
        .get('/orgs/github')
        .reply(200, { ...sampleGithubOrg })

      await expect(github.fetchOrgByLogin('github')).resolves.toEqual(sampleGithubOrg)
    })

    it('Should throw an error if the organization does not exist', async () => {
      nock('https://api.github.com')
        .get('/orgs/github')
        .reply(404, {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/orgs/orgs#get-an-organization',
          status: '404'
        })

      await expect(github.fetchOrgByLogin('github')).rejects.toThrow('Not Found - https://docs.github.com/rest/orgs/orgs#get-an-organization')
    })
  })

  describe('fetchOrgReposListByLogin', () => {
    it.each([undefined, null, ''])('Should throw when no login are provided', async (login) => {
      await expect(github.fetchOrgReposListByLogin(login)).rejects.toThrow('Organization name is required')
    })

    it('Should fetch organization repositories by login', async () => {
      nock('https://api.github.com')
        .get('/orgs/github/repos?type=public&per_page=100')
        .reply(200, sampleGithubListOrgRepos)

      await expect(github.fetchOrgReposListByLogin('github')).resolves.toEqual(sampleGithubListOrgRepos)
    })

    it('Should handle pagination correctly', async () => {
      const firstPageRepos = largeSampleGithubListOrgRepos.slice(0, 100)
      const secondPageRepos = largeSampleGithubListOrgRepos.slice(100)

      nock('https://api.github.com')
        .get('/orgs/github/repos?type=public&per_page=100')
        .reply(200, firstPageRepos, {
          link: '<https://api.github.com/orgs/github/repos?type=public&per_page=100&page=2>; rel="next"'
        })
        .get('/orgs/github/repos?type=public&per_page=100&page=2')
        .reply(200, secondPageRepos, {
          link: null
        })

      await expect(github.fetchOrgReposListByLogin('github')).resolves.toEqual([...firstPageRepos, ...secondPageRepos])
    })

    it('Should throw an error if the organization does not exist', async () => {
      nock('https://api.github.com')
        .get('/orgs/github/repos?type=public&per_page=100')
        .reply(404, {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/repos/repos#list-organization-repositories',
          status: '404'
        })

      await expect(github.fetchOrgReposListByLogin('github')).rejects.toThrow('Not Found - https://docs.github.com/rest/repos/repos#list-organization-repositories')
    })
  })

  describe('fetchRepoByFullName', () => {
    it.each([undefined, null, ''])('Should throw when no full name are provided', async (fullName) => {
      await expect(github.fetchRepoByFullName(fullName)).rejects.toThrow('The full name is required')
    })

    it.each(['github/', '/repos', 'github'])('Should throw when the full name is invalid', async (fullName) => {
      await expect(github.fetchRepoByFullName(fullName)).rejects.toThrow('The full name of the repository is invalid')
    })

    it('Should fetch repository by full name', async () => {
      nock('https://api.github.com')
        .get('/repos/github/.github')
        .reply(200, sampleGithubRepository)

      await expect(github.fetchRepoByFullName('github/.github')).resolves.toEqual(sampleGithubRepository)
    })

    it('Should throw an error if the repository does not exist', async () => {
      nock('https://api.github.com')
        .get('/repos/github/.github')
        .reply(404, {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/repos/repos#get-a-repository',
          status: '404'
        })

      await expect(github.fetchRepoByFullName('github/.github')).rejects.toThrow('Not Found - https://docs.github.com/rest/repos/repos#get-a-repository')
    })
  })

  describe('mappers', () => {
    it('Should map organization data correctly', () => {
      const mappedData = github.mappers.org(sampleGithubOrg)
      expect(mappedData).toMatchSnapshot()
    })

    it('Should map repository data correctly', () => {
      const mappedData = github.mappers.repo(sampleGithubRepository)
      expect(mappedData).toMatchSnapshot()
    })
  })
})

describe('OSSF Provider', () => {
  describe('performScorecardAnalysis', () => {
    it.todo('Should perform scorecard analysis')
    it.todo('Should throw an error if the repository does not exist')
    it.todo('Should throw an error if there are network issues')
  })
  describe('mappers', () => {
    it('Should map scorecard data correctly', () => {
      const mappedData = ossf.mappers.result({ ...sampleOSSFScorecardResult, analysis_execution_time: 19876 })
      expect(mappedData).toMatchSnapshot()
    })
  })
})
