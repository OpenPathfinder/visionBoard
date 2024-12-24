const inquirer = require('inquirer').default
const { initializeStore } = require('../store')
const { logger } = require('../utils')
const debug = require('debug')('cli:checklists')
const { stringToArray } = require('@ulisesgascon/string-to-array')
const checks = require('../checks')

async function listChecklist (knex, options = {}) {
  const { getAllChecklists } = initializeStore(knex)
  const checklists = await getAllChecklists(knex)
  checklists.forEach(checklist => {
    logger.info(`- [${checklist.author}][${checklist.code_name}] ${checklist.title}`)
  })
  logger.info('------------------------------------')
  logger.info(`Available checklists: ${checklists.length}.`)
  return checklists
}

async function runChecklist (knex, options = {}) {
  const { getAllChecklists, getAllProjects, getAllChecksInChecklistById } = initializeStore(knex)
  const checklists = await getAllChecklists(knex)
  const projects = await getAllProjects(knex)
  const validCommandNames = checklists.map((item) => item.code_name)
  const validProjectNames = ['ALL'].concat(projects.map((item) => item.name))

  if (Object.keys(options).length && !validCommandNames.includes(options.name)) {
    throw new Error('Invalid checklist name. Please enter a valid checklist name.')
  }

  if (options.projectScope && options.projectScope.length > 0) {
    const invalidProjects = stringToArray(options.projectScope[0]).filter((project) => !validProjectNames.includes(project))
    if (invalidProjects.length > 0) {
      throw new Error(`Invalid project names: ${invalidProjects.join(', ')}`)
    }
  }

  if (validProjectNames.length === 1) {
    throw new Error('No projects in database. Please add projects to run checklists')
  }

  const answers = options.name
    ? options
    : await inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'What is the name (code_name) of the checklist?',
        choices: validCommandNames,
        when: () => !options.name
      },
      {
        type: 'checkbox',
        name: 'projectScope',
        choices: validProjectNames,
        message: 'Choose the projects to run the checklist against',
        when: () => !options.name
      }
    ])

  if (!answers.projectScope || answers.projectScope?.length === 0 || stringToArray(answers.projectScope[0]).includes('ALL')) {
    answers.projectScope = undefined
    logger.info('Running checklist against all projects')
  } else {
    const projectsSelected = stringToArray(answers.projectScope[0])
    answers.projectScope = projectsSelected.map(p => projects.find(project => project.name === p))
    logger.info('Running checklist against specific projects')
  }

  debug('Running checklist with code_name:', answers.name)

  const checklist = checklists.find(checklist => checklist.code_name === answers.name)
  const checksToRun = await getAllChecksInChecklistById(knex, checklist.id)

  for (const check of checksToRun) {
    if (check.implementation_status !== 'completed') {
      logger.info(`Check (${check.code_name}) is not implemented yet. skipping...`)
      continue
    }
    logger.info(`Running check (${check.code_name})`)
    await checks[check.code_name](knex, { projects: answers.projectScope })
  }

  logger.info(`Checklist (${answers.name}) ran successfully`)
}

module.exports = {
  listChecklist,
  runChecklist
}
