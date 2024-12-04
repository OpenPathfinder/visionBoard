const { validateGithubOrg } = require('../src/schemas')

// https://docs.github.com/en/rest/orgs/orgs?apiVersion=2022-11-28#get-an-organization
const sampleGithubOrg = {
  login: 'github',
  id: 1,
  node_id: 'MDEyOk9yZ2FuaXphdGlvbjE=',
  url: 'https://api.github.com/orgs/github',
  repos_url: 'https://api.github.com/orgs/github/repos',
  events_url: 'https://api.github.com/orgs/github/events',
  hooks_url: 'https://api.github.com/orgs/github/hooks',
  issues_url: 'https://api.github.com/orgs/github/issues',
  members_url: 'https://api.github.com/orgs/github/members{/member}',
  public_members_url: 'https://api.github.com/orgs/github/public_members{/member}',
  avatar_url: 'https://github.com/images/error/octocat_happy.gif',
  description: 'A great organization',
  name: 'github',
  company: 'GitHub',
  blog: 'https://github.com/blog',
  location: 'San Francisco',
  email: 'octocat@github.com',
  twitter_username: 'github',
  is_verified: true,
  has_organization_projects: true,
  has_repository_projects: true,
  public_repos: 2,
  public_gists: 1,
  followers: 20,
  following: 0,
  html_url: 'https://github.com/octocat',
  created_at: '2008-01-14T04:33:35Z',
  type: 'Organization',
  total_private_repos: 100,
  owned_private_repos: 100,
  private_gists: 81,
  disk_usage: 10000,
  collaborators: 8,
  billing_email: 'mona@github.com',
  plan: {
    name: 'Medium',
    space: 400,
    private_repos: 20,
    filled_seats: 4,
    seats: 5
  },
  default_repository_permission: 'read',
  members_can_create_repositories: true,
  two_factor_requirement_enabled: true,
  members_allowed_repository_creation_type: 'all',
  members_can_create_public_repositories: false,
  members_can_create_private_repositories: false,
  members_can_create_internal_repositories: false,
  members_can_create_pages: true,
  members_can_create_public_pages: true,
  members_can_create_private_pages: true,
  members_can_fork_private_repositories: false,
  web_commit_signoff_required: false,
  updated_at: '2014-03-03T18:58:10Z',
  deploy_keys_enabled_for_repositories: false,
  dependency_graph_enabled_for_new_repositories: false,
  dependabot_alerts_enabled_for_new_repositories: false,
  dependabot_security_updates_enabled_for_new_repositories: false,
  advanced_security_enabled_for_new_repositories: false,
  secret_scanning_enabled_for_new_repositories: false,
  secret_scanning_push_protection_enabled_for_new_repositories: false,
  secret_scanning_push_protection_custom_link: 'https://github.com/octo-org/octo-repo/blob/main/im-blocked.md',
  secret_scanning_push_protection_custom_link_enabled: false
}

describe('schemas', () => {
  describe('validateGithubOrg', () => {
    test('Should not throw an error with valid data', () => {
      expect(() => validateGithubOrg(sampleGithubOrg)).not.toThrow()
    })

    test('Should not throw with additional data', () => {
      const additionalData = { ...sampleGithubOrg, additionalKey: 'value' }
      expect(() => validateGithubOrg(additionalData)).not.toThrow()
    })

    test('Should throw an error with invalid data', () => {
      const invalidData = { ...sampleGithubOrg, login: 123 }
      expect(() => validateGithubOrg(invalidData)).toThrow()
    })
  })
})