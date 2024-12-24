const debug = require('debug')('store')

const getAllFn = knex => (table) => {
  debug(`Fetching all records from ${table}...`)
  return knex(table).select('*')
}

const addFn = knex => (table, record) => {
  debug(`Inserting ${record} in ${table}`)
  return knex(table).insert(record).returning('*')
}

const upsertRecord = async ({ knex, table, uniqueCriteria, data }) => {
  const existingRecord = await knex(table).where(uniqueCriteria).first()
  if (existingRecord) {
    return knex(table).where(uniqueCriteria).update(data).returning('*')
  } else {
    return knex(table)
      .insert({ ...uniqueCriteria, ...data })
      .returning('*')
  }
}

const updateGithubOrganization = knex => (organization) => {
  const { login } = organization
  debug(`Updating organization (${login})...`)
  return knex('github_organizations').where({ login }).update(organization).returning('*')
}

const addGithubOrganization = knex => async (organization) => {
  const organizationExists = await knex('github_organizations').where({ html_url: organization.html_url }).first()
  debug(`Checking if organization (${organization.login}) exists...`)
  if (organizationExists) {
    throw new Error(`Organization with login (${organization.login}) already exists`)
  }
  debug(`Inserting organization (${organization.login})...`)
  return knex('github_organizations').insert(organization).returning('*')
}

const addProject = knex => async (project) => {
  const { name, category } = project
  const projectExists = await knex('projects').where({ name }).first()
  debug(`Checking if project (${name}) exists...`)
  if (projectExists) {
    throw new Error(`Project with name (${name}) already exists`)
  }
  debug(`Inserting project (${name})...`)
  return knex('projects').insert({
    name,
    category
  }).returning('*')
}

const getCheckByCodeName = knex => (codeName) => {
  debug(`Getting check by code name (${codeName})...`)
  return knex('compliance_checks').where({ code_name: codeName }).first()
}

const deleteAlertsByComplianceCheckId = knex => (complianceCheckId) => {
  debug(`Deleting alerts by compliance_check_id (${complianceCheckId})...`)
  return knex('compliance_checks_alerts').where({ compliance_check_id: complianceCheckId }).delete()
}

const deleteTasksByComplianceCheckId = knex => (complianceCheckId) => {
  debug(`Deleting tasks by compliance_check_id (${complianceCheckId})...`)
  return knex('compliance_checks_tasks').where({ compliance_check_id: complianceCheckId }).delete()
}
const upsertComplianceCheckResult = (knex) => (data) =>
  upsertRecord({
    knex,
    table: 'compliance_checks_results',
    uniqueCriteria: { compliance_check_id: data.compliance_check_id },
    data
  })

const upsertOSSFScorecard = (knex) => (data) => upsertRecord({
  table: 'ossf_scorecard_results',
  knex,
  uniqueCriteria: {
    github_repository_id: data.github_repository_id,
    scorecard_commit: data.scorecard_commit
  },
  data
})

const upsertGithubRepository = (knex) => (repository, orgId) => upsertRecord({
  table: 'github_repositories',
  knex,
  uniqueCriteria: {
    full_name: repository.full_name,
    github_organization_id: orgId
  },
  data: { ...repository, github_organization_id: orgId }
})

const getAllChecksInChecklistById = (knex, checklistId) =>
  debug(`Fetching all checks in checklist by id (${checklistId})...`) ||
  knex('checklist_items')
    .join('compliance_checks', 'compliance_checks.id', 'checklist_items.compliance_check_id')
    .where('checklist_items.checklist_id', checklistId)
    .select('compliance_checks.*')

const getAllGithubOrganizationsByProjectsId = (knex, projectIds) => {
  debug(`Fetching all github organizations by projects id (${projectIds})...`)
  return knex('github_organizations')
    .whereIn('github_organizations.project_id', projectIds)
    .select('*')
}

const getAllSSoftwareDesignTrainingsByProjectIds = (knex, projectIds) => {
  debug(`Fetching all software design trainings by project ids (${projectIds})...`)
  return knex('software_design_training')
    .whereIn('software_design_training.project_id', projectIds)
    .select('*')
}

const initializeStore = (knex) => {
  debug('Initializing store...')
  const getAll = getAllFn(knex)
  const addTo = addFn(knex)
  return {
    addProject: addProject(knex),
    addGithubOrganization: addGithubOrganization(knex),
    getAllGithubOrganizations: () => getAll('github_organizations'),
    updateGithubOrganization: updateGithubOrganization(knex),
    upsertGithubRepository: upsertGithubRepository(knex),
    getAllComplianceChecks: () => getAll('compliance_checks'),
    getCheckByCodeName: getCheckByCodeName(knex),
    getAllProjects: () => getAll('projects'),
    deleteTasksByComplianceCheckId: deleteTasksByComplianceCheckId(knex),
    deleteAlertsByComplianceCheckId: deleteAlertsByComplianceCheckId(knex),
    addAlert: (alert) => addTo('compliance_checks_alerts', alert),
    addTask: (task) => addTo('compliance_checks_tasks', task),
    upsertComplianceCheckResult: upsertComplianceCheckResult(knex),
    getAllSSoftwareDesignTrainings: () => getAll('software_design_training'),
    getAllGithubRepositories: () => getAll('github_repositories'),
    getAllChecklists: () => getAll('compliance_checklists'),
    getAllChecksInChecklistById,
    getAllGithubOrganizationsByProjectsId: (projectIds) => getAllGithubOrganizationsByProjectsId(knex, projectIds),
    getAllSSoftwareDesignTrainingsByProjectIds: (projectIds) => getAllSSoftwareDesignTrainingsByProjectIds(knex, projectIds),
    upsertOSSFScorecard: upsertOSSFScorecard(knex)
  }
}

module.exports = {
  initializeStore
}
