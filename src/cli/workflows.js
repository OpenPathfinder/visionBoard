const { updateGithubOrgs } = require('../workflows')
const inquirer = require('inquirer').default

const commandList = [{
  name: 'update-github-orgs',
  description: 'Check the organizations stored and update the information with the GitHub API.'
}]

const validCommandNames = commandList.map(({ name }) => name)

function listWorkflowCommand (options = {}) {
  console.log('Available workflows:')
  console.log(commandList.map(({ name, description }) => `- ${name}: ${description}`).join('\n'))
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

  if (answers.name === 'update-github-orgs') {
    await updateGithubOrgs(knex)
  }

  return answers
}

module.exports = {
  listWorkflowCommand,
  runWorkflowCommand
}
