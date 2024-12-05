export default {
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/__tests__/',
    '<rootDir>/__utils__/',
    '<rootDir>/src/database/migrations/',
    '<rootDir>/src/config/'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!octokit).+\\.js$'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/__tests__/fixtures/'
  ]
}
