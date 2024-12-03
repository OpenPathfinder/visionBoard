const { Command } = require('commander')
const { getConfig } = require('./src/config')
const { projectCategories, dbSettings } = getConfig()
const { runAddProjectCommand } = require('./src/cli')
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
      console.error('Error adding project:', error.message)
      process.exit(1)
    } finally {
      await knex.destroy()
    }
  })

program.parse(process.argv)
