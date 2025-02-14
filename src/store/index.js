const debug = require('debug')('store')
const { processEntities } = require('../utils')

const getAllFn = knex => (table) => {
  debug(`Fetching all records from ${table}...`)
  return knex(table).select('*')
}

const addFn = knex => (table, record) => {
  debug(`Inserting ${record} in ${table}`)
  return knex(table).insert(record).returning('*').then(results => results[0])
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
  return knex('github_organizations').insert(organization).returning('*').then(results => results[0])
}

const addProject = knex => async (project) => {
  const { name } = project
  const projectExists = await knex('projects').where({ name }).first()
  debug(`Checking if project (${name}) exists...`)
  if (projectExists) {
    throw new Error(`Project with name (${name}) already exists`)
  }
  debug(`Inserting project (${name})...`)
  return knex('projects').insert({
    name
  }).returning('*').then(results => results[0])
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

const upsertSoftwareDesignTraining = (knex) => (data) => upsertRecord({
  table: 'software_design_training',
  knex,
  uniqueCriteria: {
    project_id: data.project_id
  },
  data
})

const getAllChecksInChecklistById = (knex, checklistId) =>
  debug(`Fetching all checks in checklist by id (${checklistId})...`) ||
  knex('checklist_items')
    .join('compliance_checks', 'compliance_checks.id', 'checklist_items.compliance_check_id')
    .where('checklist_items.checklist_id', checklistId)
    .select('compliance_checks.*')

const getAllGithubOrganizationsByProjectsId = (knex, projectIds) => {
  debug(`Fetching all github organizations by projects id (${projectIds})...`)
  if (!Array.isArray(projectIds)) {
    throw new Error('projectIds must be an array')
  }
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

const getAllOwaspTop10TrainingsByProjectIds = (knex, projectIds) => {
  debug(`Fetching all owasp trainings by project ids (${projectIds})...`)
  return knex('owasp_top10_training')
    .whereIn('owasp_top10_training.project_id', projectIds)
    .select('*')
}

const getAllGithubRepositoriesAndOrganizationByProjectId = async (knex, projectIds) => {
  debug(`Fetching all GitHub repositories by organization id (${projectIds})...`)

  if (!Array.isArray(projectIds)) {
    throw new Error('projectIds must be an array')
  }

  // Fetch data
  const results = await knex('github_organizations')
    .select(
      'github_organizations.id as org_id',
      'github_organizations.*',
      'github_repositories.id as repo_id',
      'github_repositories.*'
    )
    .whereIn('github_organizations.project_id', projectIds)
    .leftJoin(
      'github_repositories',
      'github_repositories.github_organization_id',
      'github_organizations.id'
    )

  const organizationsMap = processEntities(results, {
    idKey: 'org_id',
    excludedKeys: ['repo_id'],
    relationships: [
      {
        name: 'repositories',
        relatedIdKey: 'repo_id',
        excludedKeys: ['org_id', 'repo_id']
      }
    ]
  })

  return Array.from(organizationsMap.values())
}

const getAllOSSFResultsOfRepositoriesByProjectId = async (knex, projectIds) => {
  debug(`Fetching all scorecards results of repositories by project id (${projectIds})...`)

  if (!Array.isArray(projectIds)) {
    throw new Error('projectIds must be an array')
  }

  const results = await knex('github_organizations')
    .select(
      'github_organizations.id as org_id',
      'github_organizations.*',
      'github_repositories.id as repo_id',
      'github_repositories.*',
      'ossf_scorecard_results.id as ossf_id',
      'ossf_scorecard_results.*'
    )
    .whereIn('github_organizations.project_id', projectIds)
    .leftJoin(
      'github_repositories',
      'github_repositories.github_organization_id',
      'github_organizations.id'
    )
    .leftJoin(
      'ossf_scorecard_results',
      'ossf_scorecard_results.github_repository_id',
      'github_repositories.id'
    )

  const organizationsMap = processEntities(results, {
    idKey: 'org_id',
    excludedKeys: ['repo_id', 'ossf_id'],
    relationships: [
      {
        name: 'repositories',
        relatedIdKey: 'repo_id',
        excludedKeys: ['ossf_id', 'repo_id', 'org_id'],
        relationship: {
          name: 'ossf_results',
          relatedIdKey: 'ossf_id',
          excludedKeys: ['ossf_id', 'repo_id', 'org_id']
        }
      }
    ]
  })

  return Array.from(organizationsMap.values())
}

const initializeStore = (knex) => {
  debug('Initializing store...')
  const getAll = getAllFn(knex)
  const addTo = addFn(knex)
  return {
    addProject: addProject(knex),
    addGithubOrganization: addGithubOrganization(knex),
    updateGithubOrganization: updateGithubOrganization(knex),
    upsertGithubRepository: upsertGithubRepository(knex),
    getAllGithubOrganizations: () => getAll('github_organizations'),
    getAllComplianceChecks: () => getAll('compliance_checks'),
    getAllProjects: () => getAll('projects'),
    getAllSSoftwareDesignTrainings: () => getAll('software_design_training'),
    getAllOwaspTop10Trainings: () => getAll('owasp_top10_training'),
    getAllGithubRepositories: () => getAll('github_repositories'),
    getAllGithubRepositoriesAndOrganizationByProjectId: (organizationId) => getAllGithubRepositoriesAndOrganizationByProjectId(knex, organizationId),
    getAllOSSFResultsOfRepositoriesByProjectId: (projectId) => getAllOSSFResultsOfRepositoriesByProjectId(knex, projectId),
    getAllChecklists: () => getAll('compliance_checklists'),
    getAllResults: () => getAll('compliance_checks_results'),
    getAllTasks: () => getAll('compliance_checks_tasks'),
    getAllAlerts: () => getAll('compliance_checks_alerts'),
    getAllChecksInChecklistById,
    getAllGithubOrganizationsByProjectsId: (projectIds) => getAllGithubOrganizationsByProjectsId(knex, projectIds),
    getAllSSoftwareDesignTrainingsByProjectIds: (projectIds) => getAllSSoftwareDesignTrainingsByProjectIds(knex, projectIds),
    getAllOwaspTop10TrainingsByProjectIds: (projectIds) => getAllOwaspTop10TrainingsByProjectIds(knex, projectIds),
    getCheckByCodeName: getCheckByCodeName(knex),
    deleteTasksByComplianceCheckId: deleteTasksByComplianceCheckId(knex),
    deleteAlertsByComplianceCheckId: deleteAlertsByComplianceCheckId(knex),
    addAlert: (alert) => addTo('compliance_checks_alerts', alert),
    addTask: (task) => addTo('compliance_checks_tasks', task),
    addResult: (result) => addTo('compliance_checks_results', result),
    addSSoftwareDesignTraining: (data) => addTo('software_design_training', data),
    addOwaspTop10Training: (data) => addTo('owasp_top10_training', data),
    addGithubRepo: (repo) => addTo('github_repositories', repo),
    addOSSFScorecardResult: (ossf) => addTo('ossf_scorecard_results', ossf),
    upsertOSSFScorecard: upsertOSSFScorecard(knex),
    upsertComplianceCheckResult: upsertComplianceCheckResult(knex),
    upsertSoftwareDesignTraining: upsertSoftwareDesignTraining(knex),
    getAllOSSFResults: () => getAll('ossf_scorecard_results')
  }
}

module.exports = {
  initializeStore
}
