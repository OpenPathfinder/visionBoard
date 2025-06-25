const knexInit = require('knex')
const { getConfig } = require('../src/config')
const { bulkImport } = require('../src/importers')
const {
  resetDatabase, initializeStore
} = require('../__utils__')

const { dbSettings } = getConfig('test')

let knex
let addProject, getAllSSoftwareDesignTrainings, getAllOwaspTop10Trainings, getAllProjects

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

describe('Integration: bulkImport', () => {
  test('Should import software design training data', async () => {
    // Check the environment
    const project = await addProject({ name: 'project1' })
    let trainings = await getAllSSoftwareDesignTrainings()
    expect(trainings.length).toBe(0)

    const operationId = 'load-manual-checks'
    const data = [{ type: 'softwareDesignTraining', description: 'Software Design Training Description', implementation_status: 'pending', project_id: project.id }]

    await bulkImport({ operationId, knex, data })

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

    const operationId = 'load-manual-checks'
    const data = [{ type: 'owaspTop10Training', description: 'OWASP TOP10 Training Description', implementation_status: 'pending', project_id: project.id }]

    await bulkImport({ operationId, knex, data })

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

    const operationId = 'load-manual-checks'
    const data = [{ type: 'defineFunctionalRoles', is_subscribed: false, project_id: project.id }]

    await bulkImport({ operationId, knex, data })

    // Check the results
    const projects = await getAllProjects()
    expect(projects.length).toBe(1)
    expect(projects[0].has_defineFunctionalRoles_policy).toBe(false)
  })

  test('Should throw an error if operation is not supported', async () => {
    // Check the environment
    const project = await addProject({ name: 'project1' })
    const data = [{ type: 'defineFunctionalRoles', is_subscribed: false, project_id: project.id }]
    expect(project.has_defineFunctionalRoles_policy).toBe(null)

    // Run the import
    await expect(bulkImport({ operationId: 'invalid-operation', knex, data })).rejects.toThrow('Invalid operation')
  })
})
