const resources = [
  {
    codeName: 'softwareDesignTraining',
    name: 'M1013',
    url: 'https://attack.mitre.org/mitigations/M1013/',
    type: 'mitre'
  },
  {
    codeName: 'softwareDesignTraining',
    name: 'OpenSSF Best Practices Badge Passing Level (know_secure_design)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#0.know_secure_design',
    type: 'sources'
  },
  {
    codeName: 'owaspTop10Training',
    name: 'M1013',
    url: 'https://attack.mitre.org/mitigations/M1013/',
    type: 'mitre'
  },
  {
    codeName: 'owaspTop10Training',
    name: 'OpenSSF Best Practices Badge Passing Level (know_common_errors)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#0.know_common_errors',
    type: 'sources'
  },
  {
    codeName: 'githubOrgMFA',
    name: 'CWE-308',
    url: 'https://cwe.mitre.org/data/definitions/308.html',
    type: 'mitre'
  },
  {
    codeName: 'githubOrgMFA',
    name: 'M1032',
    url: 'https://attack.mitre.org/mitigations/M1032/',
    type: 'mitre'
  },
  {
    codeName: 'githubOrgMFA',
    name: 'OpenSSF Best Practices Badge Gold Level (require_2FA)',
    url: 'https://best.openssf.org/SCM-BestPractices/github/enterprise/enterprise_enforce_two_factor_authentication.html',
    type: 'sources'
  },
  {
    codeName: 'githubOrgMFA',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-two-factor-authentication-for-your-organization/requiring-two-factor-authentication-in-your-organization',
    type: 'how_to'
  },
  {
    codeName: 'npmOrgMFA',
    name: 'CWE-308',
    url: 'https://cwe.mitre.org/data/definitions/308.html',
    type: 'mitre'
  },
  {
    codeName: 'npmOrgMFA',
    name: 'M1032',
    url: 'https://attack.mitre.org/mitigations/M1032/',
    type: 'mitre'
  },
  {
    codeName: 'npmOrgMFA',
    name: 'OpenSSF npm Best Practices',
    url: 'https://github.com/ossf/package-manager-best-practices/blob/main/published/npm.md',
    type: 'sources'
  },
  {
    codeName: 'npmOrgMFA',
    name: 'npm Docs',
    url: 'https://docs.npmjs.com/requiring-two-factor-authentication-in-your-organization',
    type: 'how_to'
  },
  {
    codeName: 'orgToolingMFA',
    name: 'CWE-308',
    url: 'https://cwe.mitre.org/data/definitions/308.html',
    type: 'mitre'
  },
  {
    codeName: 'orgToolingMFA',
    name: 'M1032',
    url: 'https://attack.mitre.org/mitigations/M1032/',
    type: 'mitre'
  },
  {
    codeName: 'orgToolingMFA',
    name: 'CNCF CNSWP v1.0',
    url: 'https://github.com/cncf/tag-security/blob/main/security-whitepaper/v2/cloud-native-security-whitepaper.md',
    type: 'sources'
  },
  {
    codeName: 'MFAImpersonationDefense',
    name: 'CWE-290',
    url: 'https://cwe.mitre.org/data/definitions/290.html',
    type: 'mitre'
  },
  {
    codeName: 'MFAImpersonationDefense',
    name: 'CAPEC-151',
    url: 'https://capec.mitre.org/data/definitions/151.html',
    type: 'mitre'
  },
  {
    codeName: 'MFAImpersonationDefense',
    name: 'T1621',
    url: 'https://attack.mitre.org/techniques/T1621',
    type: 'mitre'
  },
  {
    codeName: 'MFAImpersonationDefense',
    name: 'M1032',
    url: 'https://attack.mitre.org/mitigations/M1032/',
    type: 'mitre'
  },
  {
    codeName: 'MFAImpersonationDefense',
    name: 'OpenSSF Best Practices Badge Gold Level (secure_2FA)',
    url: 'https://www.bestpractices.dev/en/criteria/2#2.secure_2FA',
    type: 'sources'
  },
  {
    codeName: 'MFAImpersonationDefense',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa',
    type: 'how_to'
  },
  {
    codeName: 'noSensitiveInfoInRepositories',
    name: 'CWE-540',
    url: 'https://cwe.mitre.org/data/definitions/540.html',
    type: 'mitre'
  },
  {
    codeName: 'noSensitiveInfoInRepositories',
    name: 'OpenSSF Best Practices Badge Passing Level (no_leaked_credentials)',
    url: 'https://www.bestpractices.dev/en/criteria#0.no_leaked_credentials',
    type: 'sources'
  },
  {
    codeName: 'noSensitiveInfoInRepositories',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning',
    type: 'how_to'
  },
  {
    codeName: 'injectedSecretsAtRuntime',
    name: 'CWE-538',
    url: 'https://cwe.mitre.org/data/definitions/538.html',
    type: 'mitre'
  },
  {
    codeName: 'injectedSecretsAtRuntime',
    name: 'CNCF CNSWP 2.0 #195',
    url: 'https://github.com/cncf/tag-security/blob/main/security-whitepaper/v2/cloud-native-security-whitepaper.md#secrets-encryption',
    type: 'sources'
  },
  {
    codeName: 'injectedSecretsAtRuntime',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-an-organization',
    type: 'how_to'
  },
  {
    codeName: 'scanCommitsForSensitiveInfo',
    name: 'CWE-540',
    url: 'https://cwe.mitre.org/data/definitions/540.html',
    type: 'mitre'
  },
  {
    codeName: 'scanCommitsForSensitiveInfo',
    name: 'CAPEC-150',
    url: 'https://capec.mitre.org/data/definitions/150.html',
    type: 'mitre'
  },
  {
    codeName: 'scanCommitsForSensitiveInfo',
    name: 'CNCF SSCP v1.0 #184',
    url: 'https://github.com/cncf/tag-security/blob/main/supply-chain-security/supply-chain-security-paper/sscsp.md#user-content-fnref-21-4e56305414bd02da4843ec1d7d856144',
    type: 'sources'
  },
  {
    codeName: 'scanCommitsForSensitiveInfo',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning',
    type: 'how_to'
  },
  {
    codeName: 'preventLandingSensitiveCommits',
    name: 'CWE-358',
    url: 'https://cwe.mitre.org/data/definitions/358.html',
    type: 'mitre'
  },
  {
    codeName: 'preventLandingSensitiveCommits',
    name: 'OpenSSF Best Practices Badge Passing Level (no_leaked_credentials)',
    url: 'https://www.bestpractices.dev/en/criteria#0.no_leaked_credentials',
    type: 'sources'
  },
  {
    codeName: 'preventLandingSensitiveCommits',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning',
    type: 'how_to'
  },
  {
    codeName: 'SSHKeysRequired',
    name: 'CWE-309',
    url: 'https://cwe.mitre.org/data/definitions/309.html',
    type: 'mitre'
  },
  {
    codeName: 'SSHKeysRequired',
    name: 'CNCF SSCP v1.0 #192',
    url: 'https://github.com/cncf/tag-security/blob/main/supply-chain-security/supply-chain-security-paper/sscsp.md#use-ssh-keys-to-provide-developers-access-to-source-code-repositories',
    type: 'sources'
  },
  {
    codeName: 'SSHKeysRequired',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/authentication/connecting-to-github-with-ssh/about-ssh',
    type: 'how_to'
  },
  {
    codeName: 'npmPublicationMFA',
    name: 'CWE-308',
    url: 'https://cwe.mitre.org/data/definitions/308.html',
    type: 'mitre'
  },
  {
    codeName: 'npmPublicationMFA',
    name: 'npm Docs',
    url: 'https://docs.npmjs.com/creating-and-viewing-access-tokens',
    type: 'sources'
  },
  {
    codeName: 'githubWebhookSecrets',
    name: 'CWE-306',
    url: 'https://cwe.mitre.org/data/definitions/306',
    type: 'mitre'
  },
  {
    codeName: 'githubWebhookSecrets',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#webhooks',
    type: 'sources'
  },
  {
    codeName: 'githubWebhookSecrets',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/repository/repository_webhook_no_secret.html',
    type: 'sources'
  },
  {
    codeName: 'githubWebhookSecrets',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions',
    type: 'how_to'
  },
  {
    codeName: 'restrictedOrgPermissions',
    name: 'CAPEC-180',
    url: 'https://capec.mitre.org/data/definitions/180.html',
    type: 'mitre'
  },
  {
    codeName: 'restrictedOrgPermissions',
    name: 'M1026',
    url: 'https://attack.mitre.org/mitigations/M1026/',
    type: 'mitre'
  },
  {
    codeName: 'restrictedOrgPermissions',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/organization/default_repository_permission_is_not_none.html',
    type: 'sources'
  },
  {
    codeName: 'restrictedOrgPermissions',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/setting-base-permissions-for-an-organization',
    type: 'how_to'
  },
  {
    codeName: 'adminRepoCreationOnly',
    name: 'CAPEC-122',
    url: 'https://capec.mitre.org/data/definitions/122.html',
    type: 'mitre'
  },
  {
    codeName: 'adminRepoCreationOnly',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/organization/non_admins_can_create_public_repositories.html',
    type: 'sources'
  },
  {
    codeName: 'adminRepoCreationOnly',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/organizations/managing-organization-settings/restricting-repository-creation-in-your-organization',
    type: 'how_to'
  },
  {
    codeName: 'preventBranchProtectionBypass',
    name: 'CAPEC-122',
    url: 'https://capec.mitre.org/data/definitions/122.html',
    type: 'mitre'
  },
  {
    codeName: 'preventBranchProtectionBypass',
    name: 'Github Supply Chain Security Best Practices',
    url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches',
    type: 'sources'
  },
  {
    codeName: 'preventBranchProtectionBypass',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#do-not-allow-bypassing-the-above-settings',
    type: 'how_to'
  },
  {
    codeName: 'defineFunctionalRoles',
    name: 'CAPEC-122',
    url: 'https://capec.mitre.org/data/definitions/122.html',
    type: 'mitre'
  },
  {
    codeName: 'defineFunctionalRoles',
    name: 'M1018',
    url: 'https://attack.mitre.org/mitigations/M1018/',
    type: 'mitre'
  },
  {
    codeName: 'defineFunctionalRoles',
    name: 'CNCF SSCP v1.0 #188',
    url: 'https://github.com/cncf/tag-security/blob/main/supply-chain-security/supply-chain-security-paper/sscsp.md#define-roles-aligned-to-functional-responsibilities',
    type: 'sources'
  },
  {
    codeName: 'defineFunctionalRoles',
    name: 'OpenSSF Best Practices Badge Silver Level (roles_responsibilities)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.roles_responsibilities',
    type: 'sources'
  },
  {
    codeName: 'defineFunctionalRoles',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization',
    type: 'how_to'
  },
  {
    codeName: 'githubWriteAccessRoles',
    name: 'CAPEC-180',
    url: 'https://capec.mitre.org/data/definitions/180.html',
    type: 'mitre'
  },
  {
    codeName: 'githubWriteAccessRoles',
    name: 'M1026',
    url: 'https://attack.mitre.org/mitigations/M1026/',
    type: 'mitre'
  },
  {
    codeName: 'githubWriteAccessRoles',
    name: 'CNCF SSCP v1.0 #185',
    url: 'https://github.com/cncf/tag-security/blob/main/supply-chain-security/supply-chain-security-paper/sscsp.md#define-individualsteams-that-are-responsible-for-code-in-a-repository-and-associated-coding-conventions',
    type: 'sources'
  },
  {
    codeName: 'githubWriteAccessRoles',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization',
    type: 'how_to'
  },
  {
    codeName: 'twoOrMoreOwnersForAccess',
    name: 'M1026',
    url: 'https://attack.mitre.org/mitigations/M1026/',
    type: 'mitre'
  },
  {
    codeName: 'twoOrMoreOwnersForAccess',
    name: 'OpenSSF Best Practices Badge Silver Level (access_continuity)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.access_continuity',
    type: 'sources'
  },
  {
    codeName: 'twoOrMoreOwnersForAccess',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/maintaining-ownership-continuity-for-your-organization',
    type: 'how_to'
  },
  {
    codeName: 'patchCriticalVulns30Days',
    name: 'OpenSSF Best Practices Badge Passing Level (vulnerabilities_critical_fixed)',
    url: 'https://www.bestpractices.dev/en/criteria#0.vulnerabilities_critical_fixed',
    type: 'sources'
  },
  {
    codeName: 'patchCriticalVulns30Days',
    name: 'Google Project Zero Vulnerability Disclosure Policy',
    url: 'https://googleprojectzero.blogspot.com/p/vulnerability-disclosure-policy.html',
    type: 'sources'
  },
  {
    codeName: 'patchNonCriticalVulns90Days',
    name: 'Google Project Zero Vulnerability Disclosure Policy',
    url: 'https://googleprojectzero.blogspot.com/p/vulnerability-disclosure-policy.html',
    type: 'sources'
  },
  {
    codeName: 'automateVulnDetection',
    name: 'CWE-1395',
    url: 'https://cwe.mitre.org/data/definitions/1395.html',
    type: 'mitre'
  },
  {
    codeName: 'automateVulnDetection',
    name: 'M1016',
    url: 'https://attack.mitre.org/mitigations/M1016/',
    type: 'mitre'
  },
  {
    codeName: 'automateVulnDetection',
    name: 'OWASP SCVS L1 5.4',
    url: 'https://scvs.owasp.org/scvs/v5-component-analysis/',
    type: 'sources'
  },
  {
    codeName: 'automateVulnDetection',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#dependency-update-tool',
    type: 'sources'
  },
  {
    codeName: 'automateVulnDetection',
    name: 'OpenSSF Best Practices Badge Passing Level (dependency_monitoring)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.dependency_monitoring',
    type: 'sources'
  },
  {
    codeName: 'automateVulnDetection',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/configuring-dependabot-security-updates#managing-dependabot-security-updates-for-your-repositories',
    type: 'how_to'
  },
  {
    codeName: 'staticCodeAnalysis',
    name: 'CWE-1076',
    url: 'https://cwe.mitre.org/data/definitions/1076.html',
    type: 'mitre'
  },
  {
    codeName: 'staticCodeAnalysis',
    name: 'CWE-1078',
    url: 'https://cwe.mitre.org/data/definitions/1078.html',
    type: 'mitre'
  },
  {
    codeName: 'staticCodeAnalysis',
    name: 'M1016',
    url: 'https://attack.mitre.org/mitigations/M1016/',
    type: 'mitre'
  },
  {
    codeName: 'staticCodeAnalysis',
    name: 'OWASP SCVS L1 5.1',
    url: 'https://scvs.owasp.org/scvs/v5-component-analysis/',
    type: 'sources'
  },
  {
    codeName: 'staticCodeAnalysis',
    name: '',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.coding_standards_enforced',
    type: 'sources'
  },
  {
    codeName: 'staticCodeAnalysis',
    name: 'OpenSSF Best Practices Badge Silver Level (coding_standards_enforced)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.coding_standards_enforced',
    type: 'sources'
  },
  {
    codeName: 'staticCodeAnalysis',
    name: 'ESLint Docs',
    url: 'https://eslint.org/docs/latest/use/getting-started#installation-and-usage',
    type: 'how_to'
  },
  {
    codeName: 'resolveLinterWarnings',
    name: 'CWE-1127',
    url: 'https://cwe.mitre.org/data/definitions/1127.html',
    type: 'mitre'
  },
  {
    codeName: 'resolveLinterWarnings',
    name: 'OpenSSF Best Practices Badge Silver Level (warnings_strict)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.warnings_strict',
    type: 'sources'
  },
  {
    codeName: 'resolveLinterWarnings',
    name: 'ESLint Docs',
    url: 'https://eslint.org/docs/latest/use/getting-started#installation-and-usage',
    type: 'how_to'
  },
  {
    codeName: 'staticAppSecTesting',
    name: 'CWE-1076',
    url: 'https://cwe.mitre.org/data/definitions/1076.html',
    type: 'mitre'
  },
  {
    codeName: 'staticAppSecTesting',
    name: 'CWE-1078',
    url: 'https://cwe.mitre.org/data/definitions/1078.html',
    type: 'mitre'
  },
  {
    codeName: 'staticAppSecTesting',
    name: 'M1016',
    url: 'https://attack.mitre.org/mitigations/M1016/',
    type: 'mitre'
  },
  {
    codeName: 'staticAppSecTesting',
    name: 'OWASP SCVS L1 6.6\nOpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#sast',
    type: 'sources'
  },
  {
    codeName: 'staticAppSecTesting',
    name: 'OpenSSF Best Practices Badge Gold Level (static_analysis_common_vulnerabilities)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.static_analysis_common_vulnerabilities',
    type: 'sources'
  },
  {
    codeName: 'staticAppSecTesting',
    name: 'OpenSSF Best Practices Badge Gold Level (test_continuous_integration)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#2.test_continuous_integration',
    type: 'sources'
  },
  {
    codeName: 'staticAppSecTesting',
    name: 'CodeQL Docs',
    url: 'https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql',
    type: 'how_to'
  },
  {
    codeName: 'commitStatusChecks',
    name: 'CWE-358',
    url: 'https://cwe.mitre.org/data/definitions/358.html',
    type: 'mitre'
  },
  {
    codeName: 'commitStatusChecks',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#branch-protection',
    type: 'sources'
  },
  {
    codeName: 'commitStatusChecks',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/repository/requires_status_checks.html',
    type: 'sources'
  },
  {
    codeName: 'commitStatusChecks',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging',
    type: 'how_to'
  },
  {
    codeName: 'securityMdMeetsOpenJSCVD',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#security-policy',
    type: 'sources'
  },
  {
    codeName: 'securityMdMeetsOpenJSCVD',
    name: 'OpenSSF Best Practices Badge Silver Level (vulnerability_response_process)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.vulnerability_response_process',
    type: 'sources'
  },
  {
    codeName: 'useCVDToolForVulns',
    name: 'OpenSSF Best Practices Badge Passing Level (vulnerability_report_private)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#0.vulnerability_report_private',
    type: 'sources'
  },
  {
    codeName: 'useCVDToolForVulns',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/configuring-private-vulnerability-reporting-for-an-organization',
    type: 'how_to'
  },
  {
    codeName: 'vulnResponse14Days',
    name: 'OpenSSF Best Practices Badge Passing Level (vulnerability_report_response)',
    url: 'https://www.bestpractices.dev/en/criteria#0.vulnerability_report_response',
    type: 'sources'
  },
  {
    codeName: 'incidentResponsePlan',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/#operations',
    type: 'sources'
  },
  {
    codeName: 'assignCVEForKnownVulns',
    name: 'OpenSSF Best Practices Badge Passing Level (release_notes_vulns)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#0.release_notes_vulns',
    type: 'sources'
  },
  {
    codeName: 'includeCVEInReleaseNotes',
    name: 'OpenSSF Best Practices Badge Passing Level (release_notes_vulns)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#0.release_notes_vulns',
    type: 'sources'
  },
  {
    codeName: 'regressionTestsForVulns',
    name: 'OpenSSF Best Practices Badge Silver Level (regression_tests_added50)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.regression_tests_added50',
    type: 'sources'
  },
  {
    codeName: 'defaultTokenPermissionsReadOnly',
    name: 'CWE-250',
    url: 'https://cwe.mitre.org/data/definitions/250.html',
    type: 'mitre'
  },
  {
    codeName: 'defaultTokenPermissionsReadOnly',
    name: 'CAPEC-69',
    url: 'https://capec.mitre.org/data/definitions/69.html',
    type: 'mitre'
  },
  {
    codeName: 'blockWorkflowPRApproval',
    name: 'CWE-250',
    url: 'https://cwe.mitre.org/data/definitions/250.html',
    type: 'mitre'
  },
  {
    codeName: 'blockWorkflowPRApproval',
    name: 'CAPEC-69',
    url: 'https://capec.mitre.org/data/definitions/69.html',
    type: 'mitre'
  },
  {
    codeName: 'blockWorkflowPRApproval',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#token-permissions',
    type: 'sources'
  },
  {
    codeName: 'blockWorkflowPRApproval',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/repository/actions_can_approve_pull_requests.html',
    type: 'sources'
  },
  {
    codeName: 'blockWorkflowPRApproval',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise#preventing-github-actions-from-creating-or-approving-pull-requests',
    type: 'how_to'
  },
  {
    codeName: 'noForcePushDefaultBranch',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#branch-protection',
    type: 'sources'
  },
  {
    codeName: 'noForcePushDefaultBranch',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/repository/missing_default_branch_protection_force_push.html',
    type: 'sources'
  },
  {
    codeName: 'noForcePushDefaultBranch',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches',
    type: 'how_to'
  },
  {
    codeName: 'preventDeletionDefaultBranch',
    name: 'CWE-267',
    url: 'https://cwe.mitre.org/data/definitions/267.html',
    type: 'mitre'
  },
  {
    codeName: 'preventDeletionDefaultBranch',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#branch-protection',
    type: 'sources'
  },
  {
    codeName: 'preventDeletionDefaultBranch',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/repository/missing_default_branch_protection_deletion.html',
    type: 'sources'
  },
  {
    codeName: 'preventDeletionDefaultBranch',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches',
    type: 'how_to'
  },
  {
    codeName: 'upToDateDefaultBranchBeforeMerge',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#branch-protection',
    type: 'sources'
  },
  {
    codeName: 'upToDateDefaultBranchBeforeMerge',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/repository/requires_branches_up_to_date_before_merge.html',
    type: 'sources'
  },
  {
    codeName: 'upToDateDefaultBranchBeforeMerge',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging',
    type: 'how_to'
  },
  {
    codeName: 'restrictOrgSecrets',
    name: 'CWE-250',
    url: 'https://cwe.mitre.org/data/definitions/250.html',
    type: 'mitre'
  },
  {
    codeName: 'restrictOrgSecrets',
    name: 'CAPEC-69',
    url: 'https://capec.mitre.org/data/definitions/69.html',
    type: 'mitre'
  },
  {
    codeName: 'restrictOrgSecrets',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/actions/all_repositories_can_run_github_actions.html',
    type: 'sources'
  },
  {
    codeName: 'restrictOrgSecrets',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#managing-github-actions-permissions-for-your-repository',
    type: 'how_to'
  },
  {
    codeName: 'verifiedActionsOnly',
    name: 'CWE-1357',
    url: 'https://cwe.mitre.org/data/definitions/1357.html',
    type: 'mitre'
  },
  {
    codeName: 'verifiedActionsOnly',
    name: 'CAPEC-17',
    url: 'https://capec.mitre.org/data/definitions/17.html',
    type: 'mitre'
  },
  {
    codeName: 'verifiedActionsOnly',
    name: 'CAPEC-538',
    url: 'https://capec.mitre.org/data/definitions/538.html',
    type: 'mitre'
  },
  {
    codeName: 'verifiedActionsOnly',
    name: 'CAPEC-446',
    url: 'https://capec.mitre.org/data/definitions/446.html',
    type: 'mitre'
  },
  {
    codeName: 'verifiedActionsOnly',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/actions/all_github_actions_are_allowed.html',
    type: 'sources'
  },
  {
    codeName: 'verifiedActionsOnly',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#allowing-select-actions-and-reusable-workflows-to-run',
    type: 'how_to'
  },
  {
    codeName: 'noSelfHostedRunners',
    name: 'CAPEC-439',
    url: 'https://capec.mitre.org/data/definitions/439.html',
    type: 'mitre'
  },
  {
    codeName: 'noSelfHostedRunners',
    name: 'Github Action Hardening Docs',
    url: 'https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#hardening-for-self-hosted-runners',
    type: 'sources'
  },
  {
    codeName: 'noSelfHostedRunners',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization#limiting-the-use-of-self-hosted-runners',
    type: 'how_to'
  },
  {
    codeName: 'noArbitraryCodeInPipeline',
    name: 'CWE-94',
    url: 'https://cwe.mitre.org/data/definitions/94.html',
    type: 'mitre'
  },
  {
    codeName: 'noArbitraryCodeInPipeline',
    name: 'CAPEC-19',
    url: 'https://capec.mitre.org/data/definitions/19.html',
    type: 'mitre'
  },
  {
    codeName: 'noArbitraryCodeInPipeline',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#dangerous-workflow',
    type: 'sources'
  },
  {
    codeName: 'limitWorkflowWritePermissions',
    name: 'CWE-250',
    url: 'https://cwe.mitre.org/data/definitions/250.html',
    type: 'mitre'
  },
  {
    codeName: 'limitWorkflowWritePermissions',
    name: 'CAPEC-69',
    url: 'https://capec.mitre.org/data/definitions/69.html',
    type: 'mitre'
  },
  {
    codeName: 'limitWorkflowWritePermissions',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#token-permissions',
    type: 'sources'
  },
  {
    codeName: 'limitWorkflowWritePermissions',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/repository/actions_can_approve_pull_requests.html',
    type: 'sources'
  },
  {
    codeName: 'limitWorkflowWritePermissions',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions',
    type: 'how_to'
  },
  {
    codeName: 'preventScriptInjection',
    name: 'CWE-454',
    url: 'https://cwe.mitre.org/data/definitions/454.html',
    type: 'mitre'
  },
  {
    codeName: 'preventScriptInjection',
    name: 'CAPEC-242',
    url: 'https://capec.mitre.org/data/definitions/242.html',
    type: 'mitre'
  },
  {
    codeName: 'preventScriptInjection',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#dangerous-workflow',
    type: 'sources'
  },
  {
    codeName: 'preventScriptInjection',
    name: 'Github Docs',
    url: 'https://securitylab.github.com/research/github-actions-untrusted-input/',
    type: 'how_to'
  },
  {
    codeName: 'consistentBuildProcessDocs',
    name: 'CWE-1068',
    url: 'https://cwe.mitre.org/data/definitions/1068.html',
    type: 'mitre'
  },
  {
    codeName: 'upgradePathDocs',
    name: 'OpenSSF Best Practices Badge Silver Level (maintenance_or_update)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.maintenance_or_update',
    type: 'sources'
  },
  {
    codeName: 'softwareArchitectureDocs',
    name: 'CWE-1053',
    url: 'https://cwe.mitre.org/data/definitions/1053.html',
    type: 'mitre'
  },
  {
    codeName: 'softwareArchitectureDocs',
    name: 'OpenSSF Best Practices Badge Silver Level (documentation_architecture)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.documentation_architecture',
    type: 'sources'
  },
  {
    codeName: 'ciAndCdPipelineAsCode',
    name: 'CNCF SSCP 1.0 #158',
    url: 'https://github.com/cncf/tag-security/blob/main/supply-chain-security/supply-chain-security-paper/sscsp.md#build-and-related-continuous-integrationcontinuous-delivery-steps-should-all-be-automated-through-a-pipeline-defined-as-code',
    type: 'sources'
  },
  {
    codeName: 'ciAndCdPipelineAsCode',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages',
    type: 'how_to'
  },
  {
    codeName: 'pinActionsToSHA',
    name: 'CWE-1357',
    url: 'https://cwe.mitre.org/data/definitions/1357.html',
    type: 'mitre'
  },
  {
    codeName: 'pinActionsToSHA',
    name: 'CAPEC-17',
    url: 'https://capec.mitre.org/data/definitions/17.html',
    type: 'mitre'
  },
  {
    codeName: 'pinActionsToSHA',
    name: 'CAPEC-538',
    url: 'https://capec.mitre.org/data/definitions/538.html',
    type: 'mitre'
  },
  {
    codeName: 'pinActionsToSHA',
    name: 'CAPEC-446',
    url: 'https://capec.mitre.org/data/definitions/446.html',
    type: 'mitre'
  },
  {
    codeName: 'pinActionsToSHA',
    name: 'CAPEC-186',
    url: 'https://capec.mitre.org/data/definitions/186.html',
    type: 'mitre'
  },
  {
    codeName: 'pinActionsToSHA',
    name: 'Github Docs',
    url: 'https://securitylab.github.com/research/github-actions-building-blocks/',
    type: 'sources'
  },
  {
    codeName: 'automateDependencyManagement',
    name: 'OWASP SCVS L1 5.7',
    url: 'https://scvs.owasp.org/scvs/v5-component-analysis/',
    type: 'sources'
  },
  {
    codeName: 'automateDependencyManagement',
    name: 'Socket.Dev',
    url: 'https://socket.dev/',
    type: 'how_to'
  },
  {
    codeName: 'machineReadableDependencies',
    name: 'OWASP SCVS L1 1.3',
    url: 'https://scvs.owasp.org/scvs/v1-inventory/#verification-requirements',
    type: 'sources'
  },
  {
    codeName: 'machineReadableDependencies',
    name: 'OpenSSF Best Practices Badge Silver Level (external_dependencies)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#1.external_dependencies://scvs.owasp.org/scvs/v1-inventory/#verification-requirements',
    type: 'sources'
  },
  {
    codeName: 'machineReadableDependencies',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-supply-chain-security#what-is-the-dependency-graph',
    type: 'how_to'
  },
  {
    codeName: 'identifyModifiedDependencies',
    name: 'OWASP SCVS L2 6.5',
    url: 'https://scvs.owasp.org/scvs/v6-pedigree-and-provenance/',
    type: 'sources'
  },
  {
    codeName: 'annualDependencyRefresh',
    name: 'OpenSSF Best Practices Badge Passing Level (maintained)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#0.maintained',
    type: 'sources'
  },
  {
    codeName: 'useHwKeyGithubAccess',
    name: 'CWE-308',
    url: 'https://cwe.mitre.org/data/definitions/308.html',
    type: 'mitre'
  },
  {
    codeName: 'useHwKeyGithubAccess',
    name: 'M1032',
    url: 'https://attack.mitre.org/mitigations/M1032/',
    type: 'mitre'
  },
  {
    codeName: 'useHwKeyGithubAccess',
    name: 'OpenSSF Great MFA Project Security Rationale',
    url: 'https://github.com/ossf/great-mfa-project/blob/main/security-rationale.md',
    type: 'sources'
  },
  {
    codeName: 'useHwKeyGithubAccess',
    name: 'NIST SP 800-63Bsup1',
    url: 'https://www.nist.gov/blogs/cybersecurity-insights/giving-nist-digital-identity-guidelines-boost-supplement-incorporating',
    type: 'sources'
  },
  {
    codeName: 'useHwKeyGithubAccess',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication#configuring-two-factor-authentication-using-a-passkey',
    type: 'how_to'
  },
  {
    codeName: 'useHwKeyGithubNonInteractive',
    name: 'CWE-308',
    url: 'https://cwe.mitre.org/data/definitions/308.html',
    type: 'mitre'
  },
  {
    codeName: 'useHwKeyGithubNonInteractive',
    name: 'M1032',
    url: 'https://attack.mitre.org/mitigations/M1032/',
    type: 'mitre'
  },
  {
    codeName: 'useHwKeyGithubNonInteractive',
    name: 'OpenSSF Great MFA Project Security Rationale',
    url: 'https://github.com/ossf/great-mfa-project/blob/main/security-rationale.md',
    type: 'sources'
  },
  {
    codeName: 'useHwKeyGithubNonInteractive',
    name: 'NIST SP 800-63Bsup1',
    url: 'https://www.nist.gov/blogs/cybersecurity-insights/giving-nist-digital-identity-guidelines-boost-supplement-incorporating',
    type: 'sources'
  },
  {
    codeName: 'useHwKeyGithubNonInteractive',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key-for-a-hardware-security-key',
    type: 'how_to'
  },
  {
    codeName: 'useHwKeyOtherContexts',
    name: 'CWE-308',
    url: 'https://cwe.mitre.org/data/definitions/308.html',
    type: 'mitre'
  },
  {
    codeName: 'useHwKeyOtherContexts',
    name: 'M1032',
    url: 'https://attack.mitre.org/mitigations/M1032/',
    type: 'mitre'
  },
  {
    codeName: 'useHwKeyOtherContexts',
    name: 'OpenSSF Great MFA Project Security Rationale',
    url: 'https://github.com/ossf/great-mfa-project/blob/main/security-rationale.md',
    type: 'sources'
  },
  {
    codeName: 'useHwKeyOtherContexts',
    name: 'NIST SP 800-63Bsup1',
    url: 'https://www.nist.gov/blogs/cybersecurity-insights/giving-nist-digital-identity-guidelines-boost-supplement-incorporating',
    type: 'sources'
  },
  {
    codeName: 'forkWorkflowApproval',
    name: 'CAPEC-180',
    url: 'https://capec.mitre.org/data/definitions/180.html',
    type: 'mitre'
  },
  {
    codeName: 'forkWorkflowApproval',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#controlling-changes-from-forks-to-workflows-in-public-repositories',
    type: 'sources'
  },
  {
    codeName: 'workflowSecurityScanner',
    name: 'M1047',
    url: 'https://attack.mitre.org/mitigations/M1047/',
    type: 'mitre'
  },
  {
    codeName: 'workflowSecurityScanner',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#token-permissions',
    type: 'sources'
  },
  {
    codeName: 'workflowSecurityScanner',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/repository/token_default_permissions_is_read_write.html',
    type: 'sources'
  },
  {
    codeName: 'workflowSecurityScanner',
    name: 'Step Security secure-repo',
    url: 'https://github.com/step-security/secure-repo',
    type: 'how_to'
  },
  {
    codeName: 'runnerSecurityScanner',
    name: 'M1047',
    url: 'https://attack.mitre.org/mitigations/M1047/',
    type: 'mitre'
  },
  {
    codeName: 'runnerSecurityScanner',
    name: 'Github Action Hardening Docs',
    url: 'https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#hardening-for-self-hosted-runners',
    type: 'sources'
  },
  {
    codeName: 'runnerSecurityScanner',
    name: 'Step Security harden-runner',
    url: 'https://github.com/step-security/harden-runner',
    type: 'how_to'
  },
  {
    codeName: 'activeAdminsSixMonths',
    name: 'M1026',
    url: 'https://attack.mitre.org/mitigations/M1026/',
    type: 'mitre'
  },
  {
    codeName: 'activeAdminsSixMonths',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/member/stale_admin_found.html',
    type: 'sources'
  },
  {
    codeName: 'activeWritersSixMonths',
    name: 'M1026',
    url: 'https://attack.mitre.org/mitigations/M1026/',
    type: 'mitre'
  },
  {
    codeName: 'activeWritersSixMonths',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/member/stale_member_found.html',
    type: 'sources'
  },
  {
    codeName: 'PRsBeforeMerge',
    name: 'CWE-778',
    url: 'https://cwe.mitre.org/data/definitions/778.html',
    type: 'mitre'
  },
  {
    codeName: 'PRsBeforeMerge',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#branch-protection',
    type: 'sources'
  },
  {
    codeName: 'PRsBeforeMerge',
    name: 'OpenSSF Best Practices Badge Passing Level (repo_track)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#0.repo_track',
    type: 'sources'
  },
  {
    codeName: 'PRsBeforeMerge',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-pull-request-reviews-before-merging',
    type: 'how_to'
  },
  {
    codeName: 'commitSignoffForWeb',
    name: 'CNCF SSCP 1.0 #325',
    url: 'https://github.com/cncf/tag-security/blob/main/supply-chain-security/supply-chain-security-paper/sscsp.md#require-signed-commits',
    type: 'sources'
  },
  {
    codeName: 'commitSignoffForWeb',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/repository/no_signed_commits.html',
    type: 'sources'
  },
  {
    codeName: 'commitSignoffForWeb',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/organizations/managing-organization-settings/managing-the-commit-signoff-policy-for-your-organization#managing-compulsory-commit-signoffs-for-your-organization',
    type: 'how_to'
  },
  {
    codeName: 'requireSignedCommits',
    name: 'CNCF SSCP 1.0 #325',
    url: 'https://github.com/cncf/tag-security/blob/main/supply-chain-security/supply-chain-security-paper/sscsp.md#require-signed-commits',
    type: 'sources'
  },
  {
    codeName: 'requireSignedCommits',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/repository/no_signed_commits.html',
    type: 'sources'
  },
  {
    codeName: 'requireSignedCommits',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-signed-commits',
    type: 'how_to'
  },
  {
    codeName: 'includePackageLock',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#sbom',
    type: 'sources'
  },
  {
    codeName: 'includePackageLock',
    name: 'npm Docs',
    url: 'https://docs.npmjs.com/cli/v10/commands/npm-sbom',
    type: 'how_to'
  },
  {
    codeName: 'includePackageLock',
    name: 'OpenSSF SBOM Naming Conventions',
    url: 'https://github.com/ossf/sbom-everywhere/blob/main/reference/sbom_naming.md',
    type: 'how_to'
  },
  {
    codeName: 'requireTwoPartyReview',
    name: 'CAPEC-670',
    url: 'https://capec.mitre.org/data/definitions/670.html',
    type: 'mitre'
  },
  {
    codeName: 'requireTwoPartyReview',
    name: 'CAPEC-443',
    url: 'https://capec.mitre.org/data/definitions/443.html',
    type: 'mitre'
  },
  {
    codeName: 'requireTwoPartyReview',
    name: 'CAPEC-438',
    url: 'https://capec.mitre.org/data/definitions/438.html',
    type: 'mitre'
  },
  {
    codeName: 'requireTwoPartyReview',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#code-review',
    type: 'sources'
  },
  {
    codeName: 'requireTwoPartyReview',
    name: 'OpenSSF Best Practices Badge Gold Level (two_person_review)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#2.two_person_review',
    type: 'sources'
  },
  {
    codeName: 'requireTwoPartyReview',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-pull-request-reviews-before-merging',
    type: 'how_to'
  },
  {
    codeName: 'requireCodeOwnersReviewForLargeTeams',
    name: 'CAPEC-670',
    url: 'https://capec.mitre.org/data/definitions/670.html',
    type: 'mitre'
  },
  {
    codeName: 'requireCodeOwnersReviewForLargeTeams',
    name: 'CAPEC-443',
    url: 'https://capec.mitre.org/data/definitions/443.html',
    type: 'mitre'
  },
  {
    codeName: 'requireCodeOwnersReviewForLargeTeams',
    name: 'CAPEC-438',
    url: 'https://capec.mitre.org/data/definitions/438.html',
    type: 'mitre'
  },
  {
    codeName: 'requireCodeOwnersReviewForLargeTeams',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#code-review',
    type: 'sources'
  },
  {
    codeName: 'requireCodeOwnersReviewForLargeTeams',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning',
    type: 'how_to'
  },
  {
    codeName: 'requirePRApprovalForMainline',
    name: 'CAPEC-670',
    url: 'https://capec.mitre.org/data/definitions/670.html',
    type: 'mitre'
  },
  {
    codeName: 'requirePRApprovalForMainline',
    name: 'CAPEC-443',
    url: 'https://capec.mitre.org/data/definitions/443.html',
    type: 'mitre'
  },
  {
    codeName: 'requirePRApprovalForMainline',
    name: 'CAPEC-438',
    url: 'https://capec.mitre.org/data/definitions/438.html',
    type: 'mitre'
  },
  {
    codeName: 'requirePRApprovalForMainline',
    name: 'OpenSSF Scorecard',
    url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md#branch-protection',
    type: 'sources'
  },
  {
    codeName: 'requirePRApprovalForMainline',
    name: 'CNCF SSCP v1.0 #190',
    url: 'https://github.com/cncf/tag-security/blob/main/supply-chain-security/supply-chain-security-paper/sscsp.md#use-branch-protection-rules',
    type: 'sources'
  },
  {
    codeName: 'requirePRApprovalForMainline',
    name: 'Github Docs',
    url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches',
    type: 'how_to'
  },
  {
    codeName: 'limitOrgOwners',
    name: 'M1026',
    url: 'https://attack.mitre.org/mitigations/M1026/',
    type: 'mitre'
  },
  {
    codeName: 'limitOrgOwners',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/member/organization_has_too_many_admins.html',
    type: 'sources'
  },
  {
    codeName: 'limitRepoAdmins',
    name: 'CAPEC-180',
    url: 'https://capec.mitre.org/data/definitions/180.html',
    type: 'mitre'
  },
  {
    codeName: 'limitRepoAdmins',
    name: 'M1026',
    url: 'https://attack.mitre.org/mitigations/M1026/',
    type: 'mitre'
  },
  {
    codeName: 'limitRepoAdmins',
    name: 'OpenSSF SCM Best Practices',
    url: 'https://best.openssf.org/SCM-BestPractices/github/repository/repository_has_too_many_admins.html',
    type: 'sources'
  },
  {
    codeName: 'patchExploitableHighVulns14Days',
    name: 'OpenSSF Best Practices Badge Passing Level (vulnerabilities_critical_fixed)',
    url: 'https://www.bestpractices.dev/en/criteria#0.vulnerabilities_critical_fixed',
    type: 'sources'
  },
  {
    codeName: 'patchExploitableHighVulns14Days',
    name: 'Google Project Zero Vulnerability Disclosure Policy',
    url: 'https://googleprojectzero.blogspot.com/p/vulnerability-disclosure-policy.html',
    type: 'sources'
  },
  {
    codeName: 'patchExploitableNoncCriticalVulns60Days',
    name: 'OpenSSF Best Practices Badge Silver Level (vulnerabilities_fixed_60_days)',
    url: 'https://www.bestpractices.dev/en/criteria#0.vulnerabilities_fixed_60_days',
    type: 'sources'
  },
  {
    codeName: 'patchExploitableNoncCriticalVulns60Days',
    name: 'OpenSSF Best Practices Badge Passing Level (static_analysis_fixed)',
    url: 'https://www.bestpractices.dev/en/criteria?details=true&rationale=true#0.static_analysis_fixed',
    type: 'sources'
  }
]

exports.up = async (knex) => {
  // Get all the compliance checks
  const complianceChecks = await knex('compliance_checks')

  // Iterate over each resource and insert it into the database
  for (const resource of resources) {
    const complianceCheckId = complianceChecks.find(check => check.code_name === resource.codeName).id

    const resourceId = await knex('compliance_checks_resources').insert({
      name: resource.name,
      url: resource.url,
      type: resource.type
    }).returning('id')

    await knex('resources_for_compliance_checks').insert({
      compliance_check_id: complianceCheckId,
      compliance_check_resource_id: resourceId[0].id
    })
  }
}

exports.down = async (knex) => {
  await knex('resources_for_compliance_checks').truncate()
  await knex.raw('TRUNCATE TABLE compliance_checks_resources CASCADE')
}
