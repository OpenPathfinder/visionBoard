const { initializeStore } = require('../src/store')
const resetDatabase = async (knex) => {
  await knex.raw('TRUNCATE TABLE software_design_training RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE owasp_top10_training RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE compliance_checks_results RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE compliance_checks_tasks RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE compliance_checks_alerts RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE github_repositories RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE github_organizations RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE projects RESTART IDENTITY CASCADE')
}

const generateGithubRepoData = (data) => {
  const { org, name, ...additionalDetails } = data
  return {
    node_id: 'MDEwOlJlcG9zaXRvcnkxMjM0NTY=',
    name,
    full_name: `${org.login}/${name}`,
    visibility: 'public',
    url: `https://github.com/${org.login}/${name}`,
    git_url: `git://github.com/${org.login}/${name}.git`,
    ssh_url: `git@github.com:${org.login}/${name}.git`,
    clone_url: `https://github.com/${org.login}/${name}.git`,
    default_branch: 'main',
    html_url: org.html_url,
    github_organization_id: org.id,
    ...additionalDetails
  }
}

module.exports = {
  generateGithubRepoData,
  resetDatabase,
  initializeStore
}
