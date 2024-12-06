export default {
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/__fixtures__/',
    '<rootDir>/__tests__/',
    '<rootDir>/__utils__/',
    '<rootDir>/src/database/migrations/',
    '<rootDir>/src/database/seeds/',
    '<rootDir>/src/config/'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!octokit).+\\.js$'
  ]
}
