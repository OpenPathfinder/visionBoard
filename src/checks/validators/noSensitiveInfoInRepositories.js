const debug = require('debug')('checks:validator:noSensitiveInfoInRepositories')
const {
  getSeverityFromPriorityGroup,
  groupArrayItemsByCriteria,
  generatePercentage
} = require('../../utils')

const groupByOrganization = groupArrayItemsByCriteria('project_id')

function getOrgFailures (projectOrgs) {
  const failedOrgs = projectOrgs
      .filter(org => org.secret_scanning_enabled_for_new_repositories === false)
      .map(org => org.login)
  const unknownOrgs = projectOrgs
      .filter(org => org.secret_scanning_enabled_for_new_repositories === null)
      .map(org => org.login)

  return { failedOrgs, unknownOrgs }
}

function getRepoFailures (repositories) {
  const failedRepos = repositories
    .filter(repo => repo.secret_scanning_status === 'disabled')
    .map(repo => repo.full_name)

  const unknownRepos = repositories
    .filter(repo => repo.secret_scanning_status === null)
    .map(repo => repo.full_name)

  return { failedRepos, unknownRepos }
}

function buildOrgMessage (failedOrgs, unknownOrgs) {
  if (failedOrgs.length) {
    return `The organization(s) (${failedOrgs.join(',')}) has not enabled secret scanning by default`
  }
  if (unknownOrgs.length) {
    return `It was not possible to confirm if the organization(s) has enabled secret scanning for new repositories in the following (${unknownOrgs.join(',')}) organization(s)`
  }
  return 'The organization(s) has secret scanning for new repositories enabled'
}

function buildRepoMessage (failedRepos, unknownRepos, totalRepos) {
  const percentage = generatePercentage(totalRepos, failedRepos.length)

  if (failedRepos.length) {
    return `${failedRepos.length} (${percentage}) repositories do not have the secret scanner enabled`
  }
  if (unknownRepos.length) {
    return 'It was not possible to confirm if some repositories have not enabled secret scanning'
  }
  return 'All repositories have the secret scanner enabled'
}

// @see: https://github.com/OpenPathfinder/visionBoard/issues/67
module.exports = ({ repositories = [], check, projects = [] }) => {
  debug('Validating that secret scanning is enabled...')
  debug('Grouping repositories by project...')
  const repositoriesGroupedByProject = groupByOrganization(repositories)

  const alerts = []
  const results = []
  const tasks = []

  debug('Processing repositories...')
  repositoriesGroupedByProject.forEach((projectOrgs) => {
    debug(`Processing Project (${projectOrgs[0].github_organization_id})`)

    const project = projects.find(p => p.id === projectOrgs[0].project_id)
    const baseData = {
      project_id: project.id,
      compliance_check_id: check.id,
      severity: getSeverityFromPriorityGroup(check.default_priority_group)
    }

    // Early check: if absolutely everything is enabled, we pass and move on
    const allReposEnabled = projectOrgs.every(
      repo => repo.secret_scanning_status === 'enabled'
    )
    const allOrgDefaultsEnabled = projectOrgs.every(
      repo => repo.secret_scanning_enabled_for_new_repositories === true
    )

    if (allReposEnabled && allOrgDefaultsEnabled) {
      results.push({
        ...baseData,
        status: 'passed',
        rationale: 'The organizations(s) and repositories have secret scanning enabled'
      })
      debug(`Processed project (${project.id}) - All passed`)
      return
    }

    // Otherwise, gather failures/unknowns
    const { failedOrgs, unknownOrgs } = getOrgFailures(projectOrgs)
    const { failedRepos, unknownRepos } = getRepoFailures(projectOrgs)

    // Build rationale pieces
    const rationaleOrg = buildOrgMessage(failedOrgs, unknownOrgs)
    const rationaleRepo = buildRepoMessage(
      failedRepos,
      unknownRepos,
      projectOrgs.length
    )

    // Determine the overall status
    const hasFailures = failedOrgs.length > 0 || failedRepos.length > 0
    const hasUnknowns = unknownOrgs.length > 0 || unknownRepos.length > 0

    let status = 'passed'
    if (hasFailures) {
      status = 'failed'
    } else if (hasUnknowns) {
      status = 'unknown'
    }

    // Determine the combined rationale
    let rationale
    if (hasFailures) {
      rationale = `${rationaleOrg}. ${rationaleRepo}`
    } else if (hasUnknowns) {
      // We have no failures, but some unknowns
      // A bit more specific: if we only have unknown orgs or unknown repos
      rationale = unknownOrgs.length && unknownRepos.length
        ? 'It was not possible to confirm if some organizations and repositories have secret scanning enabled'
        : unknownOrgs.length
          ? rationaleOrg
          : rationaleRepo
    }

    const result = {
      ...baseData,
      status,
      rationale
    }

    // Build alert and task only if we have failures
    if (hasFailures) {
      const alert = {
        ...baseData,
        title: `${rationaleOrg}. ${rationaleRepo}`,
        description: `Check the details on ${check.details_url}`
      }

      // We unify the logic for the task title:
      let taskTitle = ''

      if (failedOrgs.length && failedRepos.length) {
        const percentageOfFailedRepos = generatePercentage(
          projectOrgs.length,
          failedRepos.length
        )
        taskTitle = `Enable secret scanning for new repositories for the organization(s) (${failedOrgs.join(',')}) and ${failedRepos.length} (${percentageOfFailedRepos}) repositories`
      } else if (failedOrgs.length) {
        taskTitle = `Enable secret scanning for new repositories for the organization(s) (${failedOrgs.join(',')})`
      } else if (failedRepos.length) {
        const percentageOfFailedRepos = generatePercentage(
          projectOrgs.length,
          failedRepos.length
        )
        // @TODO: The list of failed repos can be very big, so we might need to truncate it or remove it in future releases based on community feedback.
        taskTitle = `Enable secret scanning for ${failedRepos.length} (${percentageOfFailedRepos}) repositories (${failedRepos.join(",")}) in GitHub`
      }

      // Only push if we really have something to do
      if (taskTitle) {
        const task = {
          ...baseData,
          title: taskTitle,
          description: `Check the details on ${check.details_url}`
        }
        debug(`Adding task for project (${project.id})`)
        tasks.push(task)

        debug(`Adding alert for project (${project.id})`)
        alerts.push(alert)
      }
    }

    results.push(result)
    debug(`Processed project (${project.id})`)
  })

  return {
    alerts,
    results,
    tasks
  }
}
