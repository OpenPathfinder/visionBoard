const { normalizeBoolean } = require('@ulisesgascon/normalize-boolean')

const dbSettings = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '0.0.0.0',
    user: process.env.DB_USER || 'visionBoard',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'dashboard'
  },
  ssl: normalizeBoolean(process.env.DB_SSL),
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './src/database/migrations'
  },
  seeds: {
    directory: './src/database/seeds'
  }
}

const ossfScorecardSettings = {
  dockerImage: 'ghcr.io/ossf/scorecard/v5:ea7e27ed41b76ab879c862fa0ca4cc9c61764ee4',
  parallelJobs: 5
}
const staticServer = {
  ip: process.env.IP || 'localhost',
  port: process.env.PORT || 3000
}

const defaultValues = {
  ossfScorecardSettings,
  dbSettings,
  staticServer
}
const testEnvironment = {
  ossfScorecardSettings,
  dbSettings,
  staticServer
}

const getConfig = env => {
  // NOTE: env variable should override the NODE_ENV
  const environment = env || process.env.NODE_ENV
  const config = environment === 'test' ? testEnvironment : defaultValues
  return config
}

module.exports = {
  getConfig
}
