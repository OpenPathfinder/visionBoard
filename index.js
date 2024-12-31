const { Command } = require('commander')
const pkg = require('./package.json')
const { getConfig } = require('./src/config')
const { dbSettings } = getConfig()
const { logger } = require('./src/utils')
const { runAddProjectCommand, runWorkflowCommand, listWorkflowCommand, listCheckCommand, runCheckCommand, runChecklist, listChecklist } = require('./src/cli')
const knex = require('knex')(dbSettings)

const program = new Command()

const project = program
  .command('project')
  .description('Manage projects')

// Project related commands
project
  .command('add')
  .description('Add a new project')
  .option('--name <name>', 'Name of the project')
  .option('--github-urls <urls...>', 'GitHub URLs of the project')
  .action(async (options) => {
    try {
      await runAddProjectCommand(knex, options)
    } catch (error) {
      logger.error(error)
      process.exit(1)
    } finally {
      await knex.destroy()
    }
  })

// Workflows related commands
const workflow = program
  .command('workflow')
  .description('Manage workflows')

workflow
  .command('run')
  .description('Run a workflow')
  .option('--name <name>', 'Name of the workflow')
  .action(async (options) => {
    try {
      await runWorkflowCommand(knex, options)
    } catch (error) {
      logger.error(error)
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
const check = program
  .command('check')
  .description('Manage checks')

check
  .command('list')
  .description('List all available checks')
  .action(async (options) => {
    try {
      await listCheckCommand(knex, options)
    } catch (error) {
      logger.error(error)
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
      logger.error(error)
      process.exit(1)
    } finally {
      await knex.destroy()
    }
  })

// Checklists related commands
const checklist = program
  .command('checklist')
  .description('Manage checklists')

checklist
  .command('list')
  .description('List all available checklists')
  .action(async (options) => {
    try {
      await listChecklist(knex, options)
    } catch (error) {
      logger.error(error)
      process.exit(1)
    } finally {
      await knex.destroy()
    }
  })

checklist
  .command('run')
  .description('Run a checklist')
  .option('--name <name>', 'Name of the checklist')
  .option('--project-scope <projects...>', 'Scope of the checklist')
  .action(async (options) => {
    try {
      await runChecklist(knex, options)
    } catch (error) {
      logger.error(error)
      process.exit(1)
    } finally {
      await knex.destroy()
    }
  })

// @TODO: Include tests for this command
program
  .command('version')
  .description('Show version information')
  .action(() => {
    logger.info(`${pkg.name}@${pkg.version} (${pkg.license})`)
  })

program.parse(process.argv)
