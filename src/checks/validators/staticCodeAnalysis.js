const debug = require('debug')('checks:validator:staticCodeAnalysis')
const {
  groupArrayItemsByCriteria,
  getSeverityFromPriorityGroup,
  generatePercentage
} = require('../../utils')

const groupByProject = groupArrayItemsByCriteria('project_id')

const minumumStaticCodeAnalysis = 7

// @see: https://github.com/OpenPathfinder/visionBoard/issues/75
module.exports = ({ data: ghOrgs, check, projects = [] }) => {
  debug('Validating that the repositories have static code analysis...')
  debug('Grouping repositories by project...')
  const ghOrgsGroupedByProject = groupByProject(ghOrgs)

  const alerts = []
  const results = []
  const tasks = []

  debug('Processing repositories...')
  ghOrgsGroupedByProject.forEach((projectOrgs) => {
    debug(`Processing Project (${projectOrgs[0].github_organization_id})`)
    const project = projects.find(p => p.id === projectOrgs[0].project_id)
    const projectRepositories = projectOrgs.map(org => org.repositories).flat()

    const baseData = {
      project_id: project.id,
      compliance_check_id: check.id,
      severity: getSeverityFromPriorityGroup(check.default_priority_group)
    }

    const allOSSFResultsPass = projectRepositories.every(
      repo => repo.ossf_results?.sast_score >= minumumStaticCodeAnalysis
    )

    if (allOSSFResultsPass) {
      results.push({
        ...baseData,
        status: 'passed',
        rationale: 'All repositories in all organizations have a static code analysis tool'
      })
      debug(`Processed project (${project.id}) - All passed`)
      return
    }

    const failedRepos = projectRepositories.filter(repo => Number.parseInt(repo.ossf_results?.sast_score) < minumumStaticCodeAnalysis).map(org => org.full_name)
    const unknownRepos = projectRepositories.filter(repo => repo.ossf_results?.sast_score === null).map(org => org.full_name)
    const noGenerateResults = projectRepositories.filter(repo => repo?.ossf_results == null).map(org => org.full_name)

    const result = { ...baseData }
    const task = { ...baseData }
    const alert = { ...baseData }

    if (noGenerateResults.length === projectRepositories.length) {
      result.status = 'unknown'
      result.rationale = 'No results have been generated from the OSSF Scorecard'
    } else if (failedRepos.length) {
      const percentage = generatePercentage(projectRepositories.length, failedRepos.length)

      result.status = 'failed'
      result.rationale = `${failedRepos.length} (${percentage}) repositories do not have a static code analysis tool`
      alert.title = `${failedRepos.length} (${percentage}) repositories do not have a static code analysis tool`
      alert.description = `Check the details on ${check.details_url}`
      task.title = `Add a code analysis tool for ${failedRepos.length} (${percentage}) repositories (${failedRepos.join(', ')}) in GitHub`
      task.description = `Check the details on ${check.details_url}`
    } else if (unknownRepos.length) {
      const percentage = generatePercentage(projectRepositories.length, unknownRepos.length)

      result.status = 'unknown'
      result.rationale = `${unknownRepos.length} (${percentage}) repositories could not be determined to have a code analysis tool`
    } else if (noGenerateResults.length) {
      const percentage = generatePercentage(projectRepositories.length, noGenerateResults.length)

      result.status = 'unknown'
      result.rationale = `${noGenerateResults.length} (${percentage}) repositories do not generated results from the OSSF Scorecard`
    }

    // Include only the task if was populated
    if (Object.keys(task).length > Object.keys(baseData).length) {
      debug(`Adding task for project (${project.id})`)
      tasks.push(task)
    }
    // Include only the alert if was populated
    if (Object.keys(alert).length > Object.keys(baseData).length) {
      debug(`Adding alert for project (${project.id})`)
      alerts.push(alert)
    }
    // Always include the result
    results.push(result)
    debug(`Processed project (${project.id})`)
  })

  return {
    alerts,
    results,
    tasks
  }
}
