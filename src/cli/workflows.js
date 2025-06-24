const inquirer = require('inquirer').default
const _ = require('lodash')
const debug = require('debug')('cli:workflows')
const { updateGithubOrgs, upsertGithubRepositories, runAllTheComplianceChecks, runOneComplianceCheck, upsertOSSFScorecardAnalysis } = require('../workflows')
const { generateStaticReports } = require('../reports')
const { bulkImport } = require('../importers')
const { logger } = require('../utils')
const { executeOneCheckSchema, executeOptionalProjectSchema, bulkImportSchema } = require('../schemas')

const commandList = [{
  name: 'update-github-orgs',
  isRequiredAdditionalData: false,
  isEnabled: true,
  description: 'Check the organizations stored and update the information with the GitHub API.',
  operations: null,
  workflow: updateGithubOrgs
}, {
  name: 'upsert-github-repositories',
  isRequiredAdditionalData: false,
  isEnabled: true,
  description: 'Check the organizations stored and update/create the information related to the repositories with the GitHub API.',
  operations: null,
  workflow: upsertGithubRepositories
}, {
  name: 'run-all-checks',
  isRequiredAdditionalData: false,
  isEnabled: true,
  description: 'Run all the compliance checks for the stored data.',
  operations: null,
  workflow: runAllTheComplianceChecks
}, {
  name: 'run-one-check',
  isRequiredAdditionalData: true,
  isEnabled: true,
  description: 'Run a specific compliance check for the stored data.',
  operations: null,
  schema: executeOneCheckSchema,
  workflow: runOneComplianceCheck
}, {
  name: 'upsert-ossf-scorecard',
  isRequiredAdditionalData: false,
  schema: executeOptionalProjectSchema,
  isEnabled: false,
  description: 'Upsert the OSSF Scorecard scoring by running and checking every repository in the database.',
  operations: null,
  workflow: upsertOSSFScorecardAnalysis
}, {
  name: 'generate-reports',
  isRequiredAdditionalData: false,
  isEnabled: true,
  description: 'Generate the reports for the stored data.',
  operations: null,
  workflow: generateStaticReports
}, {
  // @TODO: Move this workflow to a separate endpoint
  name: 'bulk-import',
  isRequiredAdditionalData: true,
  isEnabled: false,
  operations: [{
    id: 'load-manual-checks',
    description: 'Load manual checks from project policies',
    schema: JSON.stringify(bulkImportSchema)
  }],
  description: 'Bulk import data into visionBoard',
  workflow: bulkImport
}]

const validCommandNames = commandList.map(({ name }) => name)

const getWorkflowsDetails = () => {
  const workflows = {}
  const workflowsList = []

  commandList.forEach((workflow) => {
    const workflowName = _.kebabCase(workflow.name)
    workflowsList.push({ id: workflowName, description: workflow.description, isEnabled: workflow.isEnabled, isRequiredAdditionalData: workflow.isRequiredAdditionalData, operations: workflow.operations, schema: JSON.stringify(workflow.schema) })
    workflows[workflowName] = {
      description: workflow.description,
      workflow: workflow.workflow,
      isEnabled: workflow.isEnabled,
      isRequiredAdditionalData: workflow.isRequiredAdditionalData,
      operations: workflow.operations,
      schema: JSON.stringify(workflow.schema)
    }
  })

  return { workflows, workflowsList }
}

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
      }, {
        type: 'input',
        name: 'file',
        message: 'Where is the input file for the workflow?',
        when: ({ name }) => name === 'bulk-import'
      }
    ])

  const command = commandList.find(({ name }) => name === answers.name)
  debug(`Running workflow: ${command.name}`)
  await command.workflow(knex, answers.file)

  return answers
}

module.exports = {
  listWorkflowCommand,
  getWorkflowsDetails,
  runWorkflowCommand
}
