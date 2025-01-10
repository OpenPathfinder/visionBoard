const inquirer = require('inquirer').default
const debug = require('debug')('cli:workflows')
const { updateGithubOrgs, upsertGithubRepositories, runAllTheComplianceChecks, upsertOSSFScorecardAnalysis } = require('../workflows')
const { generateReports } = require('../reports')
const { logger } = require('../utils')

const commandList = [{
  name: 'update-github-orgs',
  description: 'Check the organizations stored and update the information with the GitHub API.',
  workflow: updateGithubOrgs
}, {
  name: 'upsert-github-repositories',
  description: 'Check the organizations stored and update/create the information related to the repositories with the GitHub API.',
  workflow: upsertGithubRepositories
}, {
  name: 'run-all-checks',
  description: 'Run all the compliance checks for the stored data.',
  workflow: runAllTheComplianceChecks
}, {
  name: 'upsert-ossf-scorecard',
  description: 'Upsert the OSSF Scorecard scoring by running and checking every repository in the database.',
  workflow: upsertOSSFScorecardAnalysis
}, {
  name: 'show-reports',
  description: 'Starts a http server that shows all the files and folders in the output directory.',
  workflow: require('../httpServer')
}, {
  name: 'generate-reports',
  description: 'Generate the reports for the stored data.',
  workflow: generateReports
}]

const validCommandNames = commandList.map(({ name }) => name)

function listWorkflowCommand (options = {}) {
  logger.info('Available workflows:')
  commandList.forEach(({ name, description }) => logger.info(`- ${name}: ${description}`))
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
