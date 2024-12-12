const debug = require('debug')('store')

const upsertGithubRepository = knex => async (repository, orgId) => {
  debug(`Upserting repository (${repository.full_name})...`)

  const existingRepository = await knex('github_repositories').where({ full_name: repository.full_name }).first()
  if (existingRepository) {
    return knex('github_repositories').where({ full_name: repository.full_name, github_organization_id: orgId }).update(repository).returning('*')
  } else {
    return knex('github_repositories').insert({ ...repository, github_organization_id: orgId }).returning('*')
  }
}

const getAllGithubOrganizations = knex => async () => {
  debug('Getting all GitHub organizations...')
  return knex('github_organizations').select()
}

const updateGithubOrganization = knex => async (organization) => {
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

const getAllComplianceChecks = knex => async () => {
  debug('Getting all checks...')
  return knex('compliance_checks').select().returning('*')
}

const getCheckByCodeName = knex => async (codeName) => {
  debug(`Getting check by code name (${codeName})...`)
  return knex('compliance_checks').where({ code_name: codeName }).first()
}

const getAllProjects = knex => async () => {
  debug('Getting all projects...')
  return knex('projects').select().returning('*')
}

const deleteAlertsByComplianceCheckId = knex => async (complianceCheckId) => {
  debug(`Deleting alerts by compliance_check_id (${complianceCheckId})...`)
  return knex('compliance_checks_alerts').where({ compliance_check_id: complianceCheckId }).delete()
}

const deleteTasksByComplianceCheckId = knex => async (complianceCheckId) => {
  debug(`Deleting tasks by compliance_check_id (${complianceCheckId})...`)
  return knex('compliance_checks_tasks').where({ compliance_check_id: complianceCheckId }).delete()
}

const addAlert = knex => async (alert) => {
  debug('Inserting alert...')
  return knex('compliance_checks_alerts').insert(alert).returning('*')
}

const addTask = knex => async (task) => {
  debug('Inserting task...')
  return knex('compliance_checks_tasks').insert(task).returning('*')
}

const upsertComplianceCheckResult = knex => async (result) => {
  const existingComplianceCheck = await knex('compliance_checks_results').where({ compliance_check_id: result.compliance_check_id }).first()
  if (existingComplianceCheck) {
    return knex('compliance_checks_results').where({ compliance_check_id: result.compliance_check_id }).update(result).returning('*')
  } else {
    return knex('compliance_checks_results').insert(result).returning('*')
  }
}

const getAllSSoftwareDesignTrainings = knex => async () => {
  debug('Getting all software design trainings...')
  return knex('software_design_training').select().returning('*')
}

const getAllGithubRepositories = knex => async () => {
  debug('Getting all GitHub repositories...')
  return knex('github_repositories').select().returning('*')
}

const upsertOSSFScorecard = knex => async (scorecard) => {
  // IMPORTANT: Check for repo_id and commit hash as multiple results can exist for the same repo
  const query = { github_repository_id: scorecard.github_repository_id, scorecard_commit: scorecard.scorecard_commit }
  const existingScorecard = await knex('ossf_scorecard_results').where(query).first()
  if (existingScorecard) {
    return knex('ossf_scorecard_results').where(query).update(scorecard).returning('*')
  } else {
    return knex('ossf_scorecard_results').insert(scorecard).returning('*')
  }
}

const initializeStore = (knex) => {
  debug('Initializing store...')
  return {
    addProject: addProject(knex),
    addGithubOrganization: addGithubOrganization(knex),
    getAllGithubOrganizations: getAllGithubOrganizations(knex),
    updateGithubOrganization: updateGithubOrganization(knex),
    upsertGithubRepository: upsertGithubRepository(knex),
    getAllComplianceChecks: getAllComplianceChecks(knex),
    getCheckByCodeName: getCheckByCodeName(knex),
    getAllProjects: getAllProjects(knex),
    deleteTasksByComplianceCheckId: deleteTasksByComplianceCheckId(knex),
    deleteAlertsByComplianceCheckId: deleteAlertsByComplianceCheckId(knex),
    addAlert: addAlert(knex),
    addTask: addTask(knex),
    upsertComplianceCheckResult: upsertComplianceCheckResult(knex),
    getAllSSoftwareDesignTrainings: getAllSSoftwareDesignTrainings(knex),
    getAllGithubRepositories: getAllGithubRepositories(knex),
    upsertOSSFScorecard: upsertOSSFScorecard(knex)
  }
}

module.exports = {
  initializeStore
}
