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

const github = {
  fetchOrgByLogin
}

module.exports = {
  github
}
