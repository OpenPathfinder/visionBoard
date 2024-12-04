const { normalizeBoolean } = require('@ulisesgascon/normalize-boolean')
const projectCategories = ['impact', 'at-large', 'incubation', 'emeritus']

const dbSettings = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '0.0.0.0',
    user: process.env.DB_USER || 'openjs',
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

const defaultValues = {
  projectCategories,
  dbSettings
}
const testEnvironment = {
  projectCategories,
  dbSettings
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
