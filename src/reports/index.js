const { logger } = require('../utils')
const ejs = require('ejs')
const { mkdir, readdir, copyFile, readFile, writeFile, rm } = require('node:fs').promises
const { join } = require('path')
const { initializeStore } = require('../store')
const { validateProjectData, validateIndexData } = require('../schemas')

const baseTemplatesPath = join(__dirname, 'templates')
const indexTemplatePath = join(baseTemplatesPath, 'index.ejs')
const projectTemplatePath = join(baseTemplatesPath, 'project.ejs')
const assetsFolder = join(__dirname, 'assets')
const destinationFolder = join(__dirname, '../../output')
const copyFolder = async (from, to) => {
  try {
    // Ensure the target directory exists
    await mkdir(to, { recursive: true })

    // Read the contents of the source directory
    const entries = await readdir(from, { withFileTypes: true })

    // Process each entry
    await Promise.all(
      entries.map(async (entry) => {
        const source = join(from, entry.name)
        const dest = join(to, entry.name)

        if (entry.isDirectory()) {
          // Recursively copy subdirectories
          await copyFolder(source, dest)
        } else {
          // Copy files
          await copyFile(source, dest)
        }
      })
    )
  } catch (error) {
    logger.warn(`Error copying folder from "${from}" to "${to}":`)
    throw error
  }
}

const collectIndexData = async (knex) => {
  const { getAllProjects, getAllChecklists, getAllComplianceChecks } = initializeStore(knex)
  try {
    const [projects, checklists, checks] = await Promise.all([
      getAllProjects(),
      getAllChecklists(),
      getAllComplianceChecks()
    ])
    const getLink = internalLinkBuilder('server')

    // Create the data object
    const data = { projects, checklists, checks, getLink }

    // Validate the data against the schema
    validateIndexData(data)

    return data
  } catch (error) {
    logger.error(`Error collecting index data: ${error.message}`)
    throw error
  }
}

// @TODO: use new store functions to collect project data individually more accurately and avoid loops
const collectProjectData = async (knex, projectId) => {
  const { getAllComplianceChecks, getProjectById, getAllGithubRepositories, getAllOSSFResults, getAllAlerts, getAllResults, getAllTasks, getAllGithubOrganizationsByProjectsId } = initializeStore(knex)
  try {
    const project = await getProjectById(projectId)
    if (!project) {
      throw new Error(`Project not found: ${projectId}`)
    }
    const [checks, ossfScorecardResults, alerts, results, tasks, githubRepos, githubOrgs] = await Promise.all([
      getAllComplianceChecks(),
      getAllOSSFResults(),
      getAllAlerts(),
      getAllResults(),
      getAllTasks(),
      getAllGithubRepositories(),
      getAllGithubOrganizationsByProjectsId([projectId])
    ])

    // Process the data
    const githubOrgsIds = githubOrgs.map(org => org.id)
    const githubReposInScope = githubRepos.filter(repo => githubOrgsIds.includes(repo.github_organization_id))
    const githubReposInScopeIds = githubReposInScope.map(repo => repo.id)
    const getLink = internalLinkBuilder('server')

    // Create the data object
    const data = {
      project,
      checks,
      alerts: alerts.filter(alert => alert.project_id === project.id),
      results: results.filter(result => result.project_id === project.id),
      tasks: tasks.filter(task => task.project_id === project.id),
      githubOrgs,
      githubRepos: githubReposInScope,
      ossfScorecardResults: ossfScorecardResults.filter(ossfResult => githubReposInScopeIds.includes(ossfResult.github_repository_id)),
      getLink
    }

    // Validate the data against the schema
    validateProjectData(data)

    return data
  } catch (error) {
    logger.error(`Error collecting project data: ${error.message}`)
    throw error
  }
}

const internalLinkBuilder = (mode = 'static') => (ref = '', project) => {
  let finalRef = ref
  // remove leading slash
  if (mode === 'static') {
    finalRef = finalRef.replace(/^\//, '')
  }
  // project specific paths
  if (project) {
    finalRef = mode === 'static' ? `${project.name}.html` : `/projects/${project.id}`
  }

  return finalRef.length > 0 ? finalRef : 'index.html'
}

const generateStaticReports = async (knex, options = { clearPreviousReports: false }) => {
  const { clearPreviousReports } = options
  if (clearPreviousReports) {
    logger.info('Clearing previous reports')
    await rm(destinationFolder, { recursive: true, force: true })
  }

  logger.info('Generating reports')
  const { getAllProjects, getAllChecklists, getAllComplianceChecks, getAllAlerts, getAllResults, getAllTasks, getAllGithubOrganizationsByProjectsId, getAllGithubRepositories, getAllOSSFResults } = initializeStore(knex)
  // Run the queries in parallel
  const [
    projects,
    checklists,
    checks,
    alerts,
    results,
    tasks,
    ossfScorecardResults,
    githubRepos
  ] = await Promise.all([
    getAllProjects(),
    getAllChecklists(),
    getAllComplianceChecks(),
    getAllAlerts(),
    getAllResults(),
    getAllTasks(),
    getAllOSSFResults(),
    getAllGithubRepositories()
  ])

  const [indexTemplate, projectTemplate] = await Promise.all([
    readFile(indexTemplatePath, 'utf8'),
    readFile(projectTemplatePath, 'utf8')
  ])
  await mkdir(destinationFolder, { recursive: true })

  // Collecting data from the database
  const indexData = {
    projects,
    checklists,
    checks,
    getLink: internalLinkBuilder('static')
  }

  // Validate index data
  validateIndexData(indexData)

  const projectsData = { }

  for (const project of projects) {
    const githubOrgs = await getAllGithubOrganizationsByProjectsId([project.id])
    const githubOrgsIds = githubOrgs.map(org => org.id)
    const githubReposInScope = githubRepos.filter(repo => githubOrgsIds.includes(repo.github_organization_id))
    const githubReposInScopeIds = githubReposInScope.map(repo => repo.id)

    const projectData = {
      project,
      checks,
      alerts: alerts.filter(alert => alert.project_id === project.id),
      results: results.filter(result => result.project_id === project.id),
      tasks: tasks.filter(task => task.project_id === project.id),
      githubOrgs,
      githubRepos: githubReposInScope,
      ossfScorecardResults: ossfScorecardResults.filter(ossfResult => githubReposInScopeIds.includes(ossfResult.github_repository_id)),
      getLink: internalLinkBuilder('static')
    }

    // Validate each project's data
    validateProjectData(projectData)

    projectsData[project.name] = projectData

    // Populate the project HTML template
    const projectHtml = ejs.render(projectTemplate, projectsData[project.name], {
      filename: projectTemplatePath,
      views: [join(__dirname, 'templates')]
    })
    // @TODO: Prevent overwriting (edge case) at creation level
    if (project.name !== 'index') {
      const safeName = encodeURIComponent(project.name)
      const projectFilename = join(destinationFolder, `${safeName}.html`)
      await writeFile(projectFilename, projectHtml)
    }
  }

  await Promise.all([
    writeFile(join(destinationFolder, 'index_data.json'), JSON.stringify(indexData, null, 2)),
    writeFile(join(destinationFolder, 'projects_data.json'), JSON.stringify(projectsData, null, 2))
  ])

  // copy assets folder
  await copyFolder(assetsFolder, join(destinationFolder, 'assets'))

  // Populate the index HTML template
  const indexHtml = ejs.render(indexTemplate, indexData, {
    filename: indexTemplatePath,
    views: [join(__dirname, 'templates')]
  })

  // Save the index HTML file
  await writeFile(join(destinationFolder, 'index.html'), indexHtml)
  logger.info('Reports generated successfully')
}

module.exports = {
  generateStaticReports,
  collectIndexData,
  collectProjectData,
  internalLinkBuilder
}
