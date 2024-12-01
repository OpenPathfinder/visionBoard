const { normalizeBoolean } = require('@ulisesgascon/normalize-boolean')
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

module.exports = {
  development: dbSettings
}
