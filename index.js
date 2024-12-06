const { Command } = require('commander')
const { getConfig } = require('./src/config')
const { projectCategories, dbSettings } = getConfig()
const { logger } = require('./src/utils')
const { runAddProjectCommand, runWorkflowCommand, listWorkflowCommand, listCheckCommand, runCheckCommand } = require('./src/cli')
const knex = require('knex')(dbSettings)

const program = new Command()

const project = program.command('project').description('Manage projects')

// Project related commands
project
  .command('add')
  .description('Add a new project')
  .option('--name <name>', 'Name of the project')
  .option('--github-urls <urls...>', 'GitHub URLs of the project')
  .option('--category <category>', `Category of the project. Choose from: ${projectCategories.join(', ')}`)
  .action(async (options) => {
    try {
      await runAddProjectCommand(knex, options)
    } catch (error) {
      logger.error('Error adding project:', error.message)
      process.exit(1)
    } finally {
      await knex.destroy()
    }
  })

// Workflows related commands
const workflow = program.command('workflow').description('Manage workflows')

workflow
  .command('run')
  .description('Run a workflow')
  .option('--name <name>', 'Name of the workflow')
  .action(async (options) => {
    try {
      await runWorkflowCommand(knex, options)
    } catch (error) {
      logger.error('Error running workflow:', error.message)
      process.exit(1)
    } finally {
      await knex.destroy()
    }
  })

workflow
  .command('list')
  .description('List all available workflows')
  .action((options) => {
    listWorkflowCommand(options)
  })

// Checks related commands
const check = program.command('check').description('Manage checks')

check
  .command('list')
  .description('List all available checks')
  .action(async (options) => {
    try {
      await listCheckCommand(knex, options)
    } catch (error) {
      logger.error('Error running check:', error.message)
      process.exit(1)
    } finally {
      await knex.destroy()
    }
  })

check
  .command('run')
  .description('Run a check')
  .option('--name <name>', 'Name of the check')
  .action(async (options) => {
    try {
      await runCheckCommand(knex, options)
    } catch (error) {
      logger.error('Error running check:', error.message)
      process.exit(1)
    } finally {
      await knex.destroy()
    }
  })

program.parse(process.argv)
