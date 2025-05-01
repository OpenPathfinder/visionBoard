const { logger } = require('../utils')
const ejs = require('ejs')
const { mkdir, readdir, copyFile, readFile, writeFile, rm } = require('node:fs').promises
const { join } = require('path')
const { initializeStore } = require('../store')

const indexTemplatePath = join(process.cwd(), 'src', 'reports', 'templates', 'index.html.ejs')
const projectTemplatePath = join(process.cwd(), 'src', 'reports', 'templates', 'project.html.ejs')
const assetsFolder = join(process.cwd(), 'src', 'reports', 'assets')
const destinationFolder = join(process.cwd(), 'output')
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

  // @TODO: Read the files in parallel
  const indexTemplate = await readFile(indexTemplatePath, 'utf8')
  const projectTemplate = await readFile(projectTemplatePath, 'utf8')
  await mkdir(join(destinationFolder, 'projects'), { recursive: true })

  // Collecting data from the database
  const indexData = {
    projects,
    checklists,
    checks
  }

  const projectsData = {}

  for (const project of projects) {
    const githubOrgs = await getAllGithubOrganizationsByProjectsId([project.id])
    const githubOrgsIds = githubOrgs.map(org => org.id)
    const githubReposInScope = githubRepos.filter(repo => githubOrgsIds.includes(repo.github_organization_id))
    const githubReposInScopeIds = githubReposInScope.map(repo => repo.id)

    projectsData[project.name] = {
      project,
      checks,
      alerts: alerts.filter(alert => alert.project_id === project.id),
      results: results.filter(result => result.project_id === project.id),
      tasks: tasks.filter(task => task.project_id === project.id),
      githubOrgs,
      githubRepos: githubReposInScope,
      ossfScorecardResults: ossfScorecardResults.filter(ossfResult => githubReposInScopeIds.includes(ossfResult.github_repository_id))
    }

    // Populate the project HTML template
    const projectHtml = ejs.render(projectTemplate, projectsData[project.name])
    const projectFilename = join(destinationFolder, 'projects', `${project.name}.html`)
    await writeFile(projectFilename, projectHtml)
  }

  // @TODO: Validate against JSON Schemas

  // @TODO: Save the files in parallel
  await writeFile('output/index_data.json', JSON.stringify(indexData, null, 2))
  await writeFile('output/projects/projects_data.json', JSON.stringify(projectsData, null, 2))

  // copy assets folder
  await copyFolder(assetsFolder, join(destinationFolder, 'assets'))

  // Populate the index HTML template
  const indexHtml = ejs.render(indexTemplate, indexData)

  // Save the index HTML file
  await writeFile('output/index.html', indexHtml)
  logger.info('Reports generated successfully')
}

module.exports = {
  generateStaticReports
}
