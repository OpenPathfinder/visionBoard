const { Octokit } = require('octokit')
const { ensureGithubToken } = require('../utils')
const debug = require('debug')('providers:github')

const fetchOrgByLogin = async (login) => {
  debug(`Fetching organization (${login})...`)
  ensureGithubToken()
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
  const { data } = await octokit.request('GET /orgs/{org}', {
    org: login
  })
  return data
}

const fetchOrgReposListByLogin = async (login) => {
  debug(`Fetching organization (${login}) repositories...`)
  ensureGithubToken()
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
  let repoList = []

  // IMPORTANT: Ignore private repositories as they might contain sensitive information
  const orgQuery = { org: login, type: 'public', per_page: 100 }

  const { data: repos } = await octokit.rest.repos.listForOrg(orgQuery)
  debug(`Got ${repos.length} repos for org: ${login}`)
  repoList = repoList.concat(repos)

  // IMPORTANT: If the org has 100 repos it might require pagination management
  if (repoList.length === 100) {
    let page = 2
    let hasMore = true
    while (hasMore) {
      debug(`Getting page ${page} for org: ${login}`)
      const { data: repos, headers } = await octokit.rest.repos.listForOrg({ ...orgQuery, page })
      debug(`Got ${repos.length} repos for org: ${login}`)
      repoList = repoList.concat(repos)
      hasMore = headers.link.includes('rel="next"')
      page += 1
    }
  }

  return repoList
}

const github = {
  fetchOrgByLogin,
  fetchOrgReposListByLogin,
}

module.exports = {
  github
}
