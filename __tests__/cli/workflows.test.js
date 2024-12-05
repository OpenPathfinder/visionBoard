const inquirer = require('inquirer').default
const knexInit = require('knex')
const { simplifyObject } = require('@ulisesgascon/simplify-object')
const { getConfig } = require('../../src/config')
const { runWorkflowCommand, listWorkflowCommand } = require('../../src/cli')
const { resetDatabase, getAllProjects, getAllGithubOrgs, addGithubOrg, addProject, getAllGithubRepos, addGithubRepo } = require('../../__utils__')
const { github } = require('../../src/providers')
const { sampleGithubOrg, sampleGithubListOrgRepos, sampleGithubRepository } = require('../../__fixtures__')

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

describe('run GENERIC - Non-Interactive Mode', () => {
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
})

describe('run update-github-orgs', () => {
  // // Mock inquirer for testing
  // jest.spyOn(inquirer, 'prompt').mockImplementation(async (questions) => {
  //   const questionMap = {
  //     'What is the name of the workflow?': 'update-github-orgs'
  //   }
  //   return questions.reduce((acc, question) => {
  //     acc[question.name] = questionMap[question.message]
  //     return acc
  //   }, {})
  // })

  test('Should throw an error when no Github orgs are stored in the database', async () => {
    const projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    const githubOrgs = await getAllGithubOrgs(knex)
    expect(githubOrgs.length).toBe(0)
    await expect(runWorkflowCommand(knex, { name: 'update-github-orgs' }))
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
    await runWorkflowCommand(knex, { name: 'update-github-orgs' })
    // Check the database changes
    githubOrgs = await getAllGithubOrgs(knex)
    expect(githubOrgs.length).toBe(1)
    expect(githubOrgs[0].description).toBe(sampleGithubOrg.description)
  })

  test.todo('Should throw an error when the Github API is not available')
})

describe('run upsert-github-repositories', () => {
  test('Should throw an error when no Github orgs are stored in the database', async () => {
    const projects = await getAllProjects(knex)
    expect(projects.length).toBe(0)
    const githubOrgs = await getAllGithubOrgs(knex)
    expect(githubOrgs.length).toBe(0)
    await expect(runWorkflowCommand(knex, { name: 'upsert-github-repositories' }))
      .rejects
      .toThrow('No organizations found. Please add organizations/projects before running this workflow.')
  })
  test('Should add the repositories related to the organization', async () => {
    // Prepare the database
    const project = await addProject(knex, { name: sampleGithubOrg.login, category: 'impact' })
    await addGithubOrg(knex, { login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id })
    const projects = await getAllProjects(knex)
    expect(projects.length).toBe(1)
    const githubOrgs = await getAllGithubOrgs(knex)
    expect(githubOrgs.length).toBe(1)
    let githubRepos = await getAllGithubRepos(knex)
    expect(githubRepos.length).toBe(0)
    // Mock the github methods used
    jest.spyOn(github, 'fetchOrgReposListByLogin').mockResolvedValue(sampleGithubListOrgRepos)
    jest.spyOn(github, 'fetchRepoByFullName').mockResolvedValue(sampleGithubRepository)
    await runWorkflowCommand(knex, { name: 'upsert-github-repositories' })
    // Check the database changes
    githubRepos = await getAllGithubRepos(knex)
    expect(githubRepos.length).toBe(1)
    expect(githubRepos[0].description).toBe(sampleGithubRepository.description)
  })
  test('Should update the repositories related to the organization', async () => {
    // Prepare the database
    const project = await addProject(knex, { name: sampleGithubOrg.login, category: 'impact' })
    const org = await addGithubOrg(knex, { login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id })
    const githubRepoData = simplifyObject(sampleGithubRepository, {
      include: ['node_id', 'name', 'full_name', 'html_url', 'url', 'git_url', 'ssh_url', 'clone_url', 'visibility', 'default_branch']
    })
    githubRepoData.github_organization_id = org.id
    githubRepoData.description = 'existing data'
    await addGithubRepo(knex, githubRepoData)
    const projects = await getAllProjects(knex)
    expect(projects.length).toBe(1)
    const githubOrgs = await getAllGithubOrgs(knex)
    expect(githubOrgs.length).toBe(1)
    let githubRepos = await getAllGithubRepos(knex)
    expect(githubRepos.length).toBe(1)
    expect(githubRepos[0].description).toBe('existing data')
    // Mock the github methods used
    jest.spyOn(github, 'fetchOrgReposListByLogin').mockResolvedValue(sampleGithubListOrgRepos)
    jest.spyOn(github, 'fetchRepoByFullName').mockResolvedValue(sampleGithubRepository)
    await runWorkflowCommand(knex, { name: 'upsert-github-repositories' })
    // Check the database changes
    githubRepos = await getAllGithubRepos(knex)
    expect(githubRepos.length).toBe(1)
    expect(githubRepos[0].description).toBe(sampleGithubRepository.description)
  })
  test.todo('Should throw an error when the Github API is not available')
})
