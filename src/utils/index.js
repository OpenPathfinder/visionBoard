const { add, parseISO, isBefore } = require('date-fns')
const isURL = require('validator/lib/isURL.js')
const pinoInit = require('pino')
const logger = pinoInit({
  transport: {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname'
    }
  },
  level: process.env.NODE_ENV === 'test' ? 'silent' : 'info'
})

const validateGithubUrl = (url) => isURL(url, { protocols: ['https'], require_protocol: true }) && url.includes('github.com')

const ensureGithubToken = () => {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is required')
  }
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

const isDateWithinPolicy = (targetDate, policy) => {
  if (!targetDate) {
    throw new Error('Target date is required')
  }

  if (!policy) {
    throw new Error('Policy is required')
  }

  // Ensure targetDate is a string
  if (typeof targetDate !== 'string') {
    targetDate = targetDate.toISOString()
  }

  const targetDateObj = parseISO(targetDate) // Parse ISO string into Date object
  let expirationDate

  // Handle expiration policy
  if (policy.endsWith('d')) {
    const days = parseInt(policy.replace('d', ''), 10)
    expirationDate = add(targetDateObj, { days })
  } else if (policy.endsWith('m')) {
    const months = parseInt(policy.replace('m', ''), 10)
    expirationDate = add(targetDateObj, { months })
  } else if (policy.endsWith('q')) {
    const quarters = parseInt(policy.replace('q', ''), 10)
    expirationDate = add(targetDateObj, { months: quarters * 3 })
  } else {
    throw new Error('Unsupported policy format')
  }

  const currentDate = new Date() // Get current date
  return isBefore(currentDate, expirationDate) // Check if current date is before expiration
}

module.exports = {
  isDateWithinPolicy,
  validateGithubUrl,
  ensureGithubToken,
  getSeverityFromPriorityGroup,
  isCheckApplicableToProjectCategory,
  groupArrayItemsByCriteria,
  logger
}
