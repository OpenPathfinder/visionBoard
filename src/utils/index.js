const isURL = require('validator/lib/isURL.js')

const validateGithubUrl = (url) => isURL(url, { protocols: ['https'], require_protocol: true }) && url.includes('github.com')

const ensureGithubToken = () => {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is required')
  }
}

module.exports = {
  validateGithubUrl,
  ensureGithubToken
}
