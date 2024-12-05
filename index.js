const { Command } = require('commander')
const { getConfig } = require('./src/config')
const { projectCategories, dbSettings } = getConfig()
const { logger } = require('./src/utils')
const { runAddProjectCommand, runWorkflowCommand, listWorkflowCommand } = require('./src/cli')
const knex = require('knex')(dbSettings)

const program = new Command()

const project = program.command('project').description('Manage projects')

// Project commands
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

// Workflow commands
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
program.parse(process.argv)
