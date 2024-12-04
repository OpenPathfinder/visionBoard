const inquirer = require('inquirer').default
const knexInit = require('knex')
const { getConfig } = require('../src/config/')
const { runAddProjectCommand } = require('../src/cli')
const { resetDatabase, getAllProjects } = require('./utils')

const { dbSettings } = getConfig('test')

// Mock inquirer for testing
jest.spyOn(inquirer, 'prompt').mockImplementation(async (questions) => {
  const questionMap = {
    'What is the name of the project?': 'eslint',
    'Enter the GitHub URLs (comma-separated):': 'https://github.com/eslint',
    'Select a category:': 'impact'
  }
  return questions.reduce((acc, question) => {
    acc[question.name] = questionMap[question.message]
    return acc
  }, {})
})

let knex

beforeAll(() => {
  knex = knexInit(dbSettings)
})
beforeEach(() => resetDatabase(knex))
afterEach(jest.clearAllMocks)
afterAll(async () => {
  await resetDatabase(knex)
  await knex.destroy()
})

describe('Interactive Mode', () => {
  test('Add a project with name, GitHub URLs, and category', async () => {
    let projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    await runAddProjectCommand(knex, {})
    projects = await getAllProjects(knex)
    expect(projects.length).toBe(1)
    expect(projects[0].name).toBe('eslint')
    expect(projects[0].category).toBe('impact')
    // @TODO: Add test for githubUrls when it is implemented
  })

  test('Prevent to add a project that already exists', async () => {
    let projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    await runAddProjectCommand(knex, {})
    projects = await getAllProjects(knex)
    expect(projects.length).toBe(1)
    await expect(runAddProjectCommand(knex, {}))
      .rejects
      .toThrow('Project with name eslint already exists')
    projects = await getAllProjects(knex)
    expect(projects.length).toBe(1)
  })
})

describe('Non-Interactive Mode', () => {
  test('Add a project with name, GitHub URLs, and category', async () => {
    let projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    await runAddProjectCommand(knex, { name: 'eslint', githubUrls: ['https://github.com/eslint'], category: 'impact' })
    projects = await getAllProjects(knex)
    expect(projects.length).toBe(1)
    expect(projects[0].name).toBe('eslint')
    expect(projects[0].category).toBe('impact')
    // @TODO: Add test for githubUrls when it is implemented
  })

  test('Prevent to add a project that already exists', async () => {
    let projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    await runAddProjectCommand(knex, { name: 'eslint', githubUrls: ['https://github.com/eslint'], category: 'impact' })
    projects = await getAllProjects(knex)
    expect(projects.length).toBe(1)
    await expect(runAddProjectCommand(knex, { name: 'eslint', githubUrls: ['https://github.com/eslint'], category: 'impact' }))
      .rejects
      .toThrow('Project with name eslint already exists')
    projects = await getAllProjects(knex)
    expect(projects.length).toBe(1)
  })

  test('Error when no name is provided', async () => {
    let projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    await expect(runAddProjectCommand(knex, { githubUrls: ['https://github.com/eslint'], category: 'impact' }))
      .rejects
      .toThrow('Project name is required')
    projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
  })

  test('Error when no GitHub URLs are provided', async () => {
    let projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    await expect(runAddProjectCommand(knex, { name: 'eslint', category: 'impact' }))
      .rejects
      .toThrow('GitHub URLs are required')
    projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
  })

  test('Error when no category is provided', async () => {
    let projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    await expect(runAddProjectCommand(knex, { name: 'eslint', githubUrls: ['https://github.com/eslint'] }))
      .rejects
      .toThrow('Category is required')
    projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
  })

  test('Error when invalid category is provided', async () => {
    let projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    await expect(runAddProjectCommand(knex, { name: 'eslint', githubUrls: ['https://github.com/eslint'], category: 'invalid' }))
      .rejects
      .toThrow('Invalid category, use one of the following')
    projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
  })

  test('Error when invalid GitHub URLs are provided', async () => {
    let projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    await expect(runAddProjectCommand(knex, { name: 'eslint', githubUrls: ['invalid-url'], category: 'impact' }))
      .rejects
      .toThrow('Invalid URL: invalid-url. Please enter valid GitHub URLs.')
    projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
  })
})
