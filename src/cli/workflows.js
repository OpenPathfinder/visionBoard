const inquirer = require('inquirer').default
const debug = require('debug')('cli:workflows')
const { updateGithubOrgs, upsertGithubRepositories } = require('../workflows')
const { logger } = require('../utils')

const commandList = [{
  name: 'update-github-orgs',
  description: 'Check the organizations stored and update the information with the GitHub API.',
  workflow: updateGithubOrgs
}, {
  name: 'upsert-github-repositories',
  description: 'Check the organizations stored and update/create the information related to the repositories with the GitHub API.',
  workflow: upsertGithubRepositories
}]

const validCommandNames = commandList.map(({ name }) => name)

function listWorkflowCommand (options = {}) {
  logger.log('Available workflows:')
  logger.log(commandList.map(({ name, description }) => `- ${name}: ${description}`).join('\n'))
  return commandList
}

async function runWorkflowCommand (knex, options = {}) {
  if (Object.keys(options).length && !validCommandNames.includes(options.name)) {
    throw new Error('Invalid workflow name. Please enter a valid workflow name.')
  }

  const answers = options.name
    ? options
    : await inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'What is the name of the workflow?',
        choices: validCommandNames,
        when: () => !options.name
      }
    ])

  const command = commandList.find(({ name }) => name === answers.name)
  debug(`Running workflow: ${command.name}`)
  await command.workflow(knex)

  return answers
}

module.exports = {
  listWorkflowCommand,
  runWorkflowCommand
}
