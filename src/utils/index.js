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

const isCheckApplicableToProjectCategory = (check, project) => {
  if (['impact', 'at-large'].includes(project.category) && check.level_active_status === 'n/a') {
    return false
  }
  if (project.category === 'incubation' && check.level_incubating_status === 'n/a') {
    return false
  }
  if (project.category === 'emeritus' && check.level_retiring_status === 'n/a') {
    return false
  }
  return true
}

const groupArrayItemsByCriteria = criteria => items => Object.values(
  items.reduce((acc, item) => {
    if (!acc[item[criteria]]) {
      acc[item[criteria]] = []
    }
    acc[item[criteria]].push(item)
    return acc
  }, {})
)

module.exports = {
  validateGithubUrl,
  ensureGithubToken,
  getSeverityFromPriorityGroup,
  isCheckApplicableToProjectCategory,
  groupArrayItemsByCriteria,
  logger
}
