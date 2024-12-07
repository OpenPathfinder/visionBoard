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

const getSeverityFromPriorityGroup = (priorityGroup) => {
  const priorityType = priorityGroup[0]
  const priorityValue = parseInt(priorityGroup.slice(1), 10)
  // Recommendations (Rxx)
  if (priorityType === 'R') {
    return 'info'
  }
  // Priorities (Pxx)
  if (priorityValue >= 0 && priorityValue <= 2) {
    return 'critical'
  } else if (priorityValue >= 3 && priorityValue <= 4) {
    return 'high'
  } else if (priorityValue >= 5 && priorityValue <= 7) {
    return 'medium'
  } else if (priorityValue >= 8) {
    return 'low'
  }
}

module.exports = {
  validateGithubUrl,
  ensureGithubToken,
  getSeverityFromPriorityGroup,
  logger
}
