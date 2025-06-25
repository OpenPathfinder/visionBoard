const knexInit = require('knex')
const { getConfig } = require('../src/config')
const { bulkImport } = require('../src/importers')
const {
  resetDatabase, initializeStore
} = require('../__utils__')
const path = require('path')

const fs = require('fs')
jest.mock('fs')

const { dbSettings } = getConfig('test')

let knex
let addProject, getAllSSoftwareDesignTrainings, getAllOwaspTop10Trainings, getAllProjects
const filePath = path.join(__dirname, '../../__fixtures__/data.json')

beforeAll(async () => {
  knex = knexInit(dbSettings);
  ({
    addProject,
    getAllSSoftwareDesignTrainings,
    getAllOwaspTop10Trainings,
    getAllProjects
  } = initializeStore(knex))
})

beforeEach(async () => {
  await resetDatabase(knex)
})

afterAll(async () => {
  await knex.destroy()
})

describe.skip('Integration: bulkImport', () => {
  test('Should import software design training data', async () => {
    // Check the environment
    const project = await addProject({ name: 'project1' })
    let trainings = await getAllSSoftwareDesignTrainings()
    expect(trainings.length).toBe(0)

    // Run the import
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue(JSON.stringify([{
      type: 'softwareDesignTraining',
      description: 'Software Design Training Description',
      implementation_status: 'pending',
      project_id: project.id
    }]))

    await bulkImport(knex, filePath)

    // Check the results
    trainings = await getAllSSoftwareDesignTrainings()
    expect(trainings.length).toBe(1)
    expect(trainings[0].description).toBe('Software Design Training Description')
    expect(trainings[0].implementation_status).toBe('pending')
  })

  test('Should import OWASP Top 10 training data', async () => {
    // Check the environment
    const project = await addProject({ name: 'project1' })
    let trainings = await getAllOwaspTop10Trainings()
    expect(trainings.length).toBe(0)

    // Run the import
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue(JSON.stringify([{
      type: 'owaspTop10Training',
      description: 'OWASP TOP10 Training Description',
      implementation_status: 'pending',
      project_id: project.id
    }]))

    await bulkImport(knex, filePath)

    // Check the results
    trainings = await getAllOwaspTop10Trainings()
    expect(trainings.length).toBe(1)
    expect(trainings[0].description).toBe('OWASP TOP10 Training Description')
    expect(trainings[0].implementation_status).toBe('pending')
  })

  test('Should import project policies data', async () => {
    // Check the environment
    const project = await addProject({ name: 'project1' })
    expect(project.has_defineFunctionalRoles_policy).toBe(null)

    // Run the import
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue(JSON.stringify([{
      type: 'defineFunctionalRoles',
      is_subscribed: false,
      project_id: project.id
    }]))

    await bulkImport(knex, filePath)

    // Check the results
    const projects = await getAllProjects()
    expect(projects.length).toBe(1)
    expect(projects[0].has_defineFunctionalRoles_policy).toBe(false)
  })

  test('Should throw an error if file not found', async () => {
    fs.existsSync.mockReturnValue(false)

    await expect(bulkImport(knex, filePath)).rejects.toThrow('File not found')
  })

  test('Should throw an error if file content is invalid', async () => {
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue('invalid json')

    await expect(bulkImport(knex, filePath)).rejects.toThrow()
  })

  test('Should throw an error if file content is not matching the JSON Schema', async () => {
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue('{}')

    await expect(bulkImport(knex, filePath)).rejects.toThrow()
  })
})
