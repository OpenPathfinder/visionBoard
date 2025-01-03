const inquirer = require('inquirer').default
const { stringToArray } = require('@ulisesgascon/string-to-array')
const isSlug = require('validator/lib/isSlug.js')
const debug = require('debug')('cli')
const { validateGithubUrl, logger } = require('../utils')
const { initializeStore } = require('../store')

async function runAddProjectCommand (knex, options = {}) {
  const { addProject, addGithubOrganization } = initializeStore(knex)

  if (Object.keys(options).length > 0) {
    if (!options.name) {
      throw new Error('Project name is required')
    }

    if (!options.githubUrls?.length) {
      throw new Error('GitHub URLs are required')
    }

    if (options.githubUrls) {
      const urls = options.githubUrls
      if (urls.length === 0) {
        throw new Error('At least one GitHub URL is required.')
      }
      for (const url of urls) {
        if (!validateGithubUrl(url)) {
          throw new Error(`Invalid URL: ${url}. Please enter valid GitHub URLs.`)
        }
      }
    }
  }

  const answers = options.name && options.githubUrls
    ? options
    : await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the project?',
        transformer: (input) => input.toLowerCase(),
        validate: (input) => {
          if (!isSlug(input)) {
            return 'Invalid project name. Please enter a valid slug.'
          }
          return true
        },
        when: () => !options.name
      },
      {
        type: 'input',
        name: 'githubUrls',
        message: 'Enter the GitHub URLs (comma-separated):',
        filter: (input) => stringToArray(input),
        transformer: (input) => input.toLowerCase(),
        validate: (input) => {
          const urls = stringToArray(input)
          if (urls.length === 0) {
            return 'At least one GitHub URL is required.'
          }
          for (const url of urls) {
            if (!validateGithubUrl(url)) {
              return `Invalid URL: ${url}. Please enter valid GitHub URLs.`
            }
          }
          return true
        },
        when: () => !options.githubUrls
      }
    ])

  answers.githubUrls = Array.isArray(answers.githubUrls) ? answers.githubUrls : stringToArray(answers.githubUrls)

  const project = await addProject({
    name: answers.name.toLowerCase()
  })

  debug(`Project (${answers.name}) added successfully!`)

  await Promise.all(answers.githubUrls.map((url) => addGithubOrganization({
    html_url: url,
    login: url.split('https://github.com/')[1],
    project_id: project.id
  })))

  debug(`All orgs were stored and linked to (${answers.name}) added successfully!`)
  logger.info(`Project (${answers.name}) added successfully!`)

  return answers
}

module.exports = {
  runAddProjectCommand
}
