const inquirer = require('inquirer').default
const knexInit = require('knex')
const { simplifyObject } = require('@ulisesgascon/simplify-object')
const { getConfig } = require('../../src/config')
const { runWorkflowCommand, listWorkflowCommand } = require('../../src/cli')
const { resetDatabase, initializeStore } = require('../../__utils__')
const { github } = require('../../src/providers')
const { sampleGithubOrg, sampleGithubListOrgRepos, sampleGithubRepository, sampleGithubOrgMembers } = require('../../__fixtures__')

const { dbSettings } = getConfig('test')

let knex
let getAllProjects,
  getAllGithubOrgs,
  addGithubOrg,
  addProject,
  getAllGithubRepos,
  getAllGithubUsers,
  getAllGithubOrgMembers,
  addGithubRepo

beforeAll(() => {
  knex = knexInit(dbSettings);
  ({
    getAllProjects,
    getAllGithubUsers,
    getAllGithubOrganizations: getAllGithubOrgs,
    getAllGithubOrganizationMembers: getAllGithubOrgMembers,
    addGithubOrganization: addGithubOrg,
    addProject,
    getAllGithubRepositories: getAllGithubRepos,
    addGithubRepo
  } = initializeStore(knex))
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
  test('Should throw an error when no Github orgs are stored in the database', async () => {
    const projects = await getAllProjects()
    expect(projects.length).toBe(0)
    const githubOrgs = await getAllGithubOrgs()
    expect(githubOrgs.length).toBe(0)
    await expect(runWorkflowCommand(knex, { name: 'update-github-orgs' }))
      .rejects
      .toThrow('No organizations found. Please add organizations/projects before running this workflow.')
  })

  test('Should update the project with new information available', async () => {
    // Prepare the database
    const project = await addProject({ name: sampleGithubOrg.login })
    await addGithubOrg({ login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id })
    const projects = await getAllProjects()
    expect(projects.length).toBe(1)
    let githubOrgs = await getAllGithubOrgs()
    expect(githubOrgs.length).toBe(1)
    expect(githubOrgs[0].description).toBe(null)
    // Mock the fetchOrgByLogin method
    jest.spyOn(github, 'fetchOrgByLogin').mockResolvedValue(sampleGithubOrg)
    await runWorkflowCommand(knex, { name: 'update-github-orgs' })
    // Check the database changes
    githubOrgs = await getAllGithubOrgs()
    expect(githubOrgs.length).toBe(1)
    expect(githubOrgs[0].description).toBe(sampleGithubOrg.description)
  })

  test.todo('Should throw an error when the Github API is not available')
})

describe('run upsert-github-repositories', () => {
  test('Should throw an error when no Github orgs are stored in the database', async () => {
    const projects = await getAllProjects()
    expect(projects.length).toBe(0)
    const githubOrgs = await getAllGithubOrgs()
    expect(githubOrgs.length).toBe(0)
    await expect(runWorkflowCommand(knex, { name: 'upsert-github-repositories' }))
      .rejects
      .toThrow('No organizations found. Please add organizations/projects before running this workflow.')
  })
  test('Should add the repositories related to the organization', async () => {
    // Prepare the database
    const project = await addProject({ name: sampleGithubOrg.login })
    await addGithubOrg({ login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id })
    const projects = await getAllProjects()
    expect(projects.length).toBe(1)
    const githubOrgs = await getAllGithubOrgs()
    expect(githubOrgs.length).toBe(1)
    let githubRepos = await getAllGithubRepos()
    expect(githubRepos.length).toBe(0)
    // Mock the github methods used
    jest.spyOn(github, 'fetchOrgReposListByLogin').mockResolvedValue(sampleGithubListOrgRepos)
    jest.spyOn(github, 'fetchRepoByFullName').mockResolvedValue(sampleGithubRepository)
    await runWorkflowCommand(knex, { name: 'upsert-github-repositories' })
    // Check the database changes
    githubRepos = await getAllGithubRepos()
    expect(githubRepos.length).toBe(1)
    expect(githubRepos[0].description).toBe(sampleGithubRepository.description)
  })
  test('Should update the repositories related to the organization', async () => {
    const project = await addProject({ name: sampleGithubOrg.login })
    const org = await addGithubOrg({ login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id })
    const githubRepoData = simplifyObject(sampleGithubRepository, {
      include: ['node_id', 'name', 'full_name', 'html_url', 'url', 'git_url', 'ssh_url', 'clone_url', 'visibility', 'default_branch']
    })
    githubRepoData.github_organization_id = org.id
    githubRepoData.description = 'existing data'
    await addGithubRepo(githubRepoData)
    const projects = await getAllProjects()
    expect(projects.length).toBe(1)
    const githubOrgs = await getAllGithubOrgs()
    expect(githubOrgs.length).toBe(1)
    let githubRepos = await getAllGithubRepos()
    expect(githubRepos.length).toBe(1)
    expect(githubRepos[0].description).toBe('existing data')
    // Mock the github methods used
    jest.spyOn(github, 'fetchOrgReposListByLogin').mockResolvedValue(sampleGithubListOrgRepos)
    jest.spyOn(github, 'fetchRepoByFullName').mockResolvedValue(sampleGithubRepository)
    await runWorkflowCommand(knex, { name: 'upsert-github-repositories' })
    // Check the database changes
    githubRepos = await getAllGithubRepos()
    expect(githubRepos.length).toBe(1)
    expect(githubRepos[0].description).toBe(sampleGithubRepository.description)
  })
  test.todo('Should throw an error when the Github API is not available')
})

describe('run upsert-github-organization-members', () => {
  test('Should throw an error when no Github orgs are stored in the database', async () => {
    const projects = await getAllProjects()
    expect(projects.length).toBe(0)
    const githubOrgs = await getAllGithubOrgs()
    expect(githubOrgs.length).toBe(0)
    await expect(runWorkflowCommand(knex, { name: 'upsert-github-organization-members' }))
      .rejects
      .toThrow('No organizations found. Please add organizations/projects before running this workflow.')
  })
  test('Should add the organization members related to the organization', async () => {
    // Prepare the database
    const project = await addProject({ name: sampleGithubOrg.login })
    await addGithubOrg({ login: sampleGithubOrg.login, html_url: sampleGithubOrg.html_url, project_id: project.id })
    const projects = await getAllProjects()
    expect(projects.length).toBe(1)
    const githubOrgs = await getAllGithubOrgs()
    expect(githubOrgs.length).toBe(1)
    let githubUsers = await getAllGithubUsers()
    let githubOrgMembers = await getAllGithubOrgMembers()
    expect(githubOrgMembers.length).toBe(0)
    expect(githubUsers.length).toBe(0)
    // Mock the github methods used
    jest.spyOn(github, 'fetchOrgMembersByLogin').mockResolvedValue(sampleGithubOrgMembers)
    await runWorkflowCommand(knex, { name: 'upsert-github-organization-members' })
    // Check the database changes
    githubUsers = await getAllGithubUsers()
    githubOrgMembers = await getAllGithubOrgMembers()
    expect(githubUsers.length).toBe(1)
    expect(githubUsers[0].login).toBe(sampleGithubOrgMembers[0].login)
    expect(githubOrgMembers.length).toBe(1)
    expect(githubOrgMembers[0].github_user_id).toBe(githubUsers[0].id)
    expect(githubOrgMembers[0].github_organization_id).toBe(githubOrgs[0].id)
  })
  test.todo('Should update the organization members related to the organization')
  test.todo('Should throw an error when the Github API is not available')
})

describe('run run-all-checks', () => {
  test.todo('Should run all the compliance checks for the stored data')
})

describe('run upsert-ossf-scorecard', () => {
  test.todo('Should upsert the OSSF Scorecard scoring by running and checking every repository in the database')
})

describe('run bulk-import', () => {
  test.todo('Should bulk import data from a JSON file')
  test.todo('Should throw an error when the file path is not provided')
  test.todo('Should throw an error when the JSON file can\'t be parsed')
  test.todo('Should throw an error when the JSON file is not valid due schema validation')
})

describe('run show-reports', () => {
  test.todo('Should start a http server that shows all the files and folders in the output directory')
})

describe('run generate-reports', () => {
  test.todo('Should generate the reports for the stored data')
})
