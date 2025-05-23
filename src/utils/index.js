const { add, parseISO, isBefore } = require('date-fns')
const isURL = require('validator/lib/isURL.js')
const pinoInit = require('pino')

// GitHub token pattern: looks for patterns matching the GitHub token structure
const GITHUB_TOKEN_PATTERN = /\b(ghp|gho|ghu|ghs|ghr|github_pat)_[A-Za-z0-9_]{1,255}\b/g

// A helper function to redact sensitive data
const redactSensitiveData = value => {
  if (typeof value === 'string') {
    return value.replace(GITHUB_TOKEN_PATTERN, '[REDACTED]')
  }
  return value
}

const logger = pinoInit({
  hooks: {
    logMethod (inputArgs, method) {
      const [msg, obj] = inputArgs

      // Redact sensitive data from message that are outside of the https://github.com/pinojs/pino/blob/main/docs/redaction.md capabilities.
      const cleanMsg = redactSensitiveData(msg)
      const cleanObj = redactSensitiveData(obj)

      return method.apply(this, [cleanMsg, cleanObj])
    }
  },
  transport: {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname'
    }
  },
  level: process.env.NODE_ENV === 'test' ? 'silent' : 'info'
})

const validateGithubUrl = (url) => {
  if (!isURL(url, { protocols: ['https'], require_protocol: true })) {
    return false
  }
  try {
    const parsedUrl = new URL(url)
    const allowedHosts = ['github.com', 'www.github.com']
    return allowedHosts.includes(parsedUrl.host)
  } catch (error) {
    return false
  }
}

const ensureGithubToken = () => {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is required')
  }
}

const getSeverityFromPriorityGroup = (priorityGroup) => {
  const priorityType = priorityGroup[0]
  const priorityValue = Number(priorityGroup.slice(1))
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

const groupArrayItemsByCriteria = criteria => items => Object.values(
  items.reduce((acc, item) => {
    if (!acc[item[criteria]]) {
      acc[item[criteria]] = []
    }
    acc[item[criteria]].push(item)
    return acc
  }, {})
)

const generatePercentage = (total, value) => {
  const percentage = (value * 100) / total

  return Number.isInteger(percentage) ? `${percentage}%` : `${percentage.toFixed(1)}%`
}

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
    const days = Number(policy.replace('d', ''))
    expirationDate = add(targetDateObj, { days })
  } else if (policy.endsWith('m')) {
    const months = Number(policy.replace('m', ''))
    expirationDate = add(targetDateObj, { months })
  } else if (policy.endsWith('q')) {
    const quarters = Number(policy.replace('q', ''))
    expirationDate = add(targetDateObj, { months: quarters * 3 })
  } else {
    throw new Error('Unsupported policy format')
  }

  const currentDate = new Date() // Get current date
  return isBefore(currentDate, expirationDate) // Check if current date is before expiration
}

const checkDatabaseConnection = async (knex) => {
  try {
    await knex.raw('SELECT 1')
    return true
  } catch (error) {
    logger.error('Database connection failed', { error })
    return false
  }
}

module.exports = {
  isDateWithinPolicy,
  validateGithubUrl,
  ensureGithubToken,
  getSeverityFromPriorityGroup,
  groupArrayItemsByCriteria,
  redactSensitiveData,
  logger,
  generatePercentage,
  checkDatabaseConnection
}
