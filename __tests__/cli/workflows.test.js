const inquirer = require('inquirer').default
const knexInit = require('knex')
const { getConfig } = require('../../src/config')
const { runWorkflowCommand, listWorkflowCommand } = require('../../src/cli')
const { resetDatabase, getAllProjects, getAllGithubOrgs, addGithubOrg, addProject } = require('../../__utils__')
const { github } = require('../../src/providers')
const { sampleGithubOrg } = require('../../__fixtures__')

const { dbSettings } = getConfig('test')

let knex

beforeAll(() => {
  knex = knexInit(dbSettings)
})
beforeEach(async () => {
  await resetDatabase(knex)
  jest.clearAllMocks()
})
afterEach(jest.clearAllMocks)
afterAll(async () => {
  await resetDatabase(knex)
  await knex.destroy()
})

describe('list - Non-Interactive Mode', () => {
  jest.spyOn(inquirer, 'prompt').mockImplementation(async () => ({}))

  test('Should provide a list of available workflows', async () => {
    // @TODO: This test can be improved, currently is used to ensure that all the commands are listed
    await expect(listWorkflowCommand()).toMatchSnapshot()
  })
})

describe('run update-github-orgs - Interactive Mode', () => {
  // Mock inquirer for testing
  jest.spyOn(inquirer, 'prompt').mockImplementation(async (questions) => {
    const questionMap = {
      'What is the name of the workflow?': 'update-github-orgs'
    }
    return questions.reduce((acc, question) => {
      acc[question.name] = questionMap[question.message]
      return acc
    }, {})
  })

  test('Should throw an error when no Github orgs are stored in the database', async () => {
    const projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    const githubOrgs = await getAllGithubOrgs(knex)
    expect(githubOrgs.length).toBe(0)
    await expect(runWorkflowCommand(knex, {}))
      .rejects
      .toThrow('No organizations found. Please add organizations/projects before running this workflow.')
  })

  test('Should update the project with new information available', async () => {
    // Prepare the database
    const project = await addProject(knex, { name: sampleGithubOrg.login, category: 'impact' })
    await addGithubOrg(knex, { login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id })
    const projects = await getAllProjects(knex)
    expect(projects.length).toBe(1)
    let githubOrgs = await getAllGithubOrgs(knex)
    expect(githubOrgs.length).toBe(1)
    expect(githubOrgs[0].description).toBe(null)
    // Mock the fetchOrgByLogin method
    jest.spyOn(github, 'fetchOrgByLogin').mockResolvedValue(sampleGithubOrg)
    await runWorkflowCommand(knex, {})
    // Check the database changes
    githubOrgs = await getAllGithubOrgs(knex)
    expect(githubOrgs.length).toBe(1)
    expect(githubOrgs[0].description).toBe(sampleGithubOrg.description)
  })

  test.todo('Should throw an error when the Github API is not available')
})

describe('run update-github-orgs - Non-Interactive Mode', () => {
  // Mock inquirer for testing
  jest.spyOn(inquirer, 'prompt').mockImplementation(async (questions) => {
    const questionMap = {
      'What is the name of the workflow?': 'update-github-orgs'
    }
    return questions.reduce((acc, question) => {
      acc[question.name] = questionMap[question.message]
      return acc
    }, {})
  })

  test('Should throw an error when invalid name is provided', async () => {
    await expect(runWorkflowCommand(knex, { name: 'invented' }))
      .rejects
      .toThrow('Invalid workflow name. Please enter a valid workflow name.')
  })

  test('Should throw an error when no name is provided', async () => {
    await expect(runWorkflowCommand(knex, { name: undefined }))
      .rejects
      .toThrow('Invalid workflow name. Please enter a valid workflow name.')
  })

  test('Should throw an error when no Github orgs are stored in the database', async () => {
    const projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    const githubOrgs = await getAllGithubOrgs(knex)
    expect(githubOrgs.length).toBe(0)
    await expect(runWorkflowCommand(knex, { name: 'update-github-orgs' }))
      .rejects
      .toThrow('No organizations found. Please add organizations/projects before running this workflow.')
  })

  test.todo('Should update the project with new information available')
  test.todo('Should throw an error when the Github API is not available')
})
