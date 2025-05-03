// @ts-check
const { test, expect } = require('@playwright/test')

/**
 * E2E tests for the website router functionality
 * This tests the routes defined in src/httpServer/routers/website.js
 */
test.describe('Website Router', () => {
  // @TODO: load this from fixtures
  const testProjectId = 1

  test('should render the index page with projects, checklists and Compliance Checks', async ({ page }) => {
    // Navigate to the root path (handled by router.get('/'))
    await page.goto('/')

    // Check that the page title contains expected text
    await expect(page).toHaveTitle(/VisionBoard Reports/)

    // Check for the header with the logo
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.locator('a')).toContainText('VisionBoard Reports')

    // Check for main content container
    const mainContent = page.locator('main.container')
    await expect(mainContent).toBeVisible()

    // Check for the Projects heading
    const projectsHeading = page.locator('[data-testid="projects-heading"]')
    await expect(projectsHeading).toBeVisible()

    // Check for project links in the list
    const projectLinks = page.locator('[data-testid="projects-list"] li a')
    const count = await projectLinks.count()

    // We should have at least one project link
    expect(count).toBeGreaterThan(0)

    // Check for the Checklists heading
    const checklistsHeading = page.locator('[data-testid="checklists-heading"]')
    await expect(checklistsHeading).toBeVisible()

    // Check for the first table
    const checklistsTable = page.locator('[data-testid="checklists-table"]')
    await expect(checklistsTable).toBeVisible()
    // Check that the table headers exist
    const docHeader = checklistsTable.locator('thead tr th:has-text("Documentation")')
    const titleHeader = checklistsTable.locator('thead tr th:has-text("Title")')
    const descHeader = checklistsTable.locator('thead tr th:has-text("Description")')
    const authorHeader = checklistsTable.locator('thead tr th:has-text("Author")')

    await expect(docHeader).toBeVisible()
    await expect(titleHeader).toBeVisible()
    await expect(descHeader).toBeVisible()
    await expect(authorHeader).toBeVisible()

    // Check for at least one row in the table
    const rows = await checklistsTable.locator('tr')
    expect(await rows.count()).toBeGreaterThan(0)

    // Check for the Compliance Checks heading
    const complianceChecksHeading = page.locator('[data-testid="compliance-checks-heading"]')
    await expect(complianceChecksHeading).toBeVisible()

    // Check for Compliance Checks Description
    const complianceChecksDescription = page.locator('[data-testid="compliance-checks-description"]')
    await expect(complianceChecksDescription).toBeVisible()

    // Check for the second table
    const complianceChecksTable = page.locator('[data-testid="compliance-checks-table"]')
    await expect(complianceChecksTable).toBeVisible()
    // Check that the table headers exist
    const docHeader2 = complianceChecksTable.locator('thead tr th:has-text("Documentation")')
    const nameHeader = complianceChecksTable.locator('thead tr th:has-text("Name")')
    const descHeader2 = complianceChecksTable.locator('thead tr th:has-text("Description")')

    await expect(docHeader2).toBeVisible()
    await expect(nameHeader).toBeVisible()
    await expect(descHeader2).toBeVisible()

    // Check for at least one row in the table
    const rows2 = await complianceChecksTable.locator('tr')
    expect(await rows2.count()).toBeGreaterThan(0)
  })

  test('should navigate to and render project details page', async ({ page }) => {
    // Navigate directly to the project page using our test project ID
    await page.goto(`/projects/${testProjectId}`)

    // Check that we're on the correct project page URL
    await expect(page).toHaveURL(`/projects/${testProjectId}`)

    // Check for the project name in the heading
    const projectHeading = page.locator('[data-testid="project-heading"]')
    await expect(projectHeading).toBeVisible()
    await expect(projectHeading).toContainText('Report')

    // Check for main content container
    const mainContent = page.locator('main.container')
    await expect(mainContent).toBeVisible()

    // Check for section headings that should be present on project pages
    const sectionHeadings = [
      '[data-testid="alerts-heading"]',
      '[data-testid="results-heading"]',
      '[data-testid="tasks-heading"]',
      '[data-testid="ossf-scorecard-heading"]',
      '[data-testid="github-orgs-heading"]',
      '[data-testid="github-repos-heading"]'
    ]

    for (const headingText of sectionHeadings) {
      const heading = page.locator(headingText)
      await expect(heading).toBeVisible()
    }

    // Check for a GitHub organization list
    const list = page.locator('[data-testid="github-orgs-list"] li')
    await expect(list).toBeVisible()

    // Check for the GitHub repositories table
    const githubReposTable = page.locator('[data-testid="github-repos-table"]')
    await expect(githubReposTable).toBeVisible()
    // Check that the table headers exist
    const repositoryHeader = githubReposTable.locator('thead tr th:has-text("Repository")')
    const starsHeader = githubReposTable.locator('thead tr th:has-text("Stars")')
    const forksHeader = githubReposTable.locator('thead tr th:has-text("Forks")')
    const subscribersHeader = githubReposTable.locator('thead tr th:has-text("Subscribers")')
    const issuesHeader = githubReposTable.locator('thead tr th:has-text("Open Issues")')

    await expect(repositoryHeader).toBeVisible()
    await expect(starsHeader).toBeVisible()
    await expect(forksHeader).toBeVisible()
    await expect(subscribersHeader).toBeVisible()
    await expect(issuesHeader).toBeVisible()

    // Check for at least one row in the table
    const rows = await githubReposTable.locator('tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('should handle invalid project IDs correctly', async ({ page }) => {
    // Test with non-numeric ID (should render 404 page)
    await page.goto('/projects/invalid')

    // Check for the Not Found heading
    const notFoundHeading = page.locator('[data-testid="not-found-title"]')
    await expect(notFoundHeading).toBeVisible()

    // Test with non-existent numeric ID
    await page.goto('/projects/999999')

    // Check for the Not Found heading
    const notFoundHeading2 = page.locator('[data-testid="not-found-title"]')
    await expect(notFoundHeading2).toBeVisible()
  })

  test('should have working navigation between pages', async ({ page }) => {
    // Start at the index page
    await page.goto('/')

    // Find project links in the list
    const projectLinks = page.locator('ul li a')

    // Click the first project link
    await projectLinks.first().click()

    // Verify we're on a project page by checking for project-specific content
    const projectHeading = page.locator('h1:has-text("Report")')
    await expect(projectHeading).toBeVisible()

    // Verify the project page URL
    await expect(page).toHaveURL(`/projects/${testProjectId}`)

    // Navigate back to the index page using the header link
    const headerLink = page.locator('header a')
    await expect(headerLink).toBeVisible()
    await headerLink.click()

    // Verify we're back at the index page by checking for index-specific content
    const welcomeHeading = page.locator('h1:has-text("Welcome")')
    await expect(welcomeHeading).toBeVisible()

    // Also verify we're at the root URL
    await expect(page).toHaveURL('/')
  })
})
