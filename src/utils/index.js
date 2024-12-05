const isURL = require('validator/lib/isURL.js')

const validateGithubUrl = (url) => isURL(url, { protocols: ['https'], require_protocol: true }) && url.includes('github.com')

const ensureGithubToken = () => {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is required')
  }
}

const defineLog = (type) => function () {
  if (process.env.NODE_ENV === 'test') {
    return () => {}
  }
  return console[type](...arguments)
}

const logger = {
  info: defineLog('info'),
  error: defineLog('error'),
  warn: defineLog('warn'),
  log: defineLog('log')
}

module.exports = {
  validateGithubUrl,
  ensureGithubToken,
  logger
}
