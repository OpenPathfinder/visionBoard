const isURL = require('validator/lib/isURL.js')

const validateGithubUrl = (url) => isURL(url, { protocols: ['https'], require_protocol: true }) && url.includes('github.com')

module.exports = {
  validateGithubUrl
}
