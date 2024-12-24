const checks = [
  {
    compliance_check_id: 2,
    code_name: 'owaspTop10Training',
    priority_group: 'P0',
    section_number: '7',
    section_name: 'code quality'
  },
  {
    compliance_check_id: 4,
    code_name: 'npmOrgMFA',
    priority_group: 'P1',
    section_number: '1',
    section_name: 'user authentication'
  },
  {
    compliance_check_id: 5,
    code_name: 'orgToolingMFA',
    priority_group: 'P1',
    section_number: '1',
    section_name: 'user authentication'
  },
  {
    compliance_check_id: 6,
    code_name: 'MFAImpersonationDefense',
    priority_group: 'P1',
    section_number: '1',
    section_name: 'user authentication'
  },
  {
    compliance_check_id: 7,
    code_name: 'noSensitiveInfoInRepositories',
    priority_group: 'P2',
    section_number: '3',
    section_name: 'service authentication'
  },
  {
    compliance_check_id: 8,
    code_name: 'injectedSecretsAtRuntime',
    priority_group: 'P2',
    section_number: '3',
    section_name: 'service authentication'
  },
  {
    compliance_check_id: 9,
    code_name: 'scanCommitsForSensitiveInfo',
    priority_group: 'P2',
    section_number: '7',
    section_name: 'code quality'
  },
  {
    compliance_check_id: 10,
    code_name: 'preventLandingSensitiveCommits',
    priority_group: 'P2',
    section_number: '7',
    section_name: 'code quality'
  },
  {
    compliance_check_id: 11,
    code_name: 'SSHKeysRequired',
    priority_group: 'P3',
    section_number: '1',
    section_name: 'user authentication'
  },
  {
    compliance_check_id: 12,
    code_name: 'npmPublicationMFA',
    priority_group: 'P3',
    section_number: '3',
    section_name: 'service authentication'
  },
  {
    compliance_check_id: 13,
    code_name: 'githubWebhookSecrets',
    priority_group: 'P3',
    section_number: '3',
    section_name: 'service authentication'
  },
  {
    compliance_check_id: 67,
    code_name: 'requireCodeOwnersReviewForLargeTeams',
    priority_group: 'R6',
    section_number: '8',
    section_name: 'code review'
  },
  {
    compliance_check_id: 14,
    code_name: 'restrictedOrgPermissions',
    priority_group: 'P4',
    section_number: '2',
    section_name: 'user account permissions'
  },
  {
    compliance_check_id: 15,
    code_name: 'adminRepoCreationOnly',
    priority_group: 'P4',
    section_number: '2',
    section_name: 'user account permissions'
  },
  {
    compliance_check_id: 16,
    code_name: 'preventBranchProtectionBypass',
    priority_group: 'P4',
    section_number: '2',
    section_name: 'user account permissions'
  },
  {
    compliance_check_id: 17,
    code_name: 'defineFunctionalRoles',
    priority_group: 'P4',
    section_number: '2',
    section_name: 'user account permissions'
  },
  {
    compliance_check_id: 18,
    code_name: 'githubWriteAccessRoles',
    priority_group: 'P4',
    section_number: '2',
    section_name: 'user account permissions'
  },
  {
    compliance_check_id: 19,
    code_name: 'twoOrMoreOwnersForAccess',
    priority_group: 'P4',
    section_number: '2',
    section_name: 'user account permissions'
  },
  {
    compliance_check_id: 20,
    code_name: 'patchCriticalVulns30Days',
    priority_group: 'P5',
    section_number: '5',
    section_name: 'vulnerability management'
  },
  {
    compliance_check_id: 21,
    code_name: 'patchNonCriticalVulns90Days',
    priority_group: 'P5',
    section_number: '5',
    section_name: 'vulnerability management'
  },
  {
    compliance_check_id: 22,
    code_name: 'automateVulnDetection',
    priority_group: 'P6',
    section_number: '11',
    section_name: 'dependency management'
  },
  {
    compliance_check_id: 23,
    code_name: 'staticCodeAnalysis',
    priority_group: 'P6',
    section_number: '7',
    section_name: 'code quality'
  },
  {
    compliance_check_id: 24,
    code_name: 'resolveLinterWarnings',
    priority_group: 'P6',
    section_number: '7',
    section_name: 'code quality'
  },
  {
    compliance_check_id: 25,
    code_name: 'staticAppSecTesting',
    priority_group: 'P6',
    section_number: '7',
    section_name: 'code quality'
  },
  {
    compliance_check_id: 26,
    code_name: 'commitStatusChecks',
    priority_group: 'P6',
    section_number: '7',
    section_name: 'code quality'
  },
  {
    compliance_check_id: 27,
    code_name: 'securityMdMeetsOpenJSCVD',
    priority_group: 'P7',
    section_number: '6',
    section_name: 'coordinated vulnerability disclosure'
  },
  {
    compliance_check_id: 28,
    code_name: 'useCVDToolForVulns',
    priority_group: 'P7',
    section_number: '6',
    section_name: 'coordinated vulnerability disclosure'
  },
  {
    compliance_check_id: 29,
    code_name: 'vulnResponse14Days',
    priority_group: 'P7',
    section_number: '6',
    section_name: 'coordinated vulnerability disclosure'
  },
  {
    compliance_check_id: 30,
    code_name: 'incidentResponsePlan',
    priority_group: 'P7',
    section_number: '6',
    section_name: 'coordinated vulnerability disclosure'
  },
  {
    compliance_check_id: 31,
    code_name: 'assignCVEForKnownVulns',
    priority_group: 'P7',
    section_number: '6',
    section_name: 'coordinated vulnerability disclosure'
  },
  {
    compliance_check_id: 32,
    code_name: 'includeCVEInReleaseNotes',
    priority_group: 'P7',
    section_number: '6',
    section_name: 'coordinated vulnerability disclosure'
  },
  {
    compliance_check_id: 33,
    code_name: 'regressionTestsForVulns',
    priority_group: 'P8',
    section_number: '7',
    section_name: 'code quality'
  },
  {
    compliance_check_id: 34,
    code_name: 'defaultTokenPermissionsReadOnly',
    priority_group: 'P9',
    section_number: '4',
    section_name: 'github workflow permissions'
  },
  {
    compliance_check_id: 35,
    code_name: 'blockWorkflowPRApproval',
    priority_group: 'P9',
    section_number: '4',
    section_name: 'github workflow permissions'
  },
  {
    compliance_check_id: 36,
    code_name: 'noForcePushDefaultBranch',
    priority_group: 'P9',
    section_number: '9',
    section_name: 'source control'
  },
  {
    compliance_check_id: 37,
    code_name: 'preventDeletionDefaultBranch',
    priority_group: 'P9',
    section_number: '9',
    section_name: 'source control'
  },
  {
    compliance_check_id: 38,
    code_name: 'upToDateDefaultBranchBeforeMerge',
    priority_group: 'P9',
    section_number: '9',
    section_name: 'source control'
  },
  {
    compliance_check_id: 39,
    code_name: 'restrictOrgSecrets',
    priority_group: 'P10',
    section_number: '4',
    section_name: 'github workflows'
  },
  {
    compliance_check_id: 40,
    code_name: 'verifiedActionsOnly',
    priority_group: 'P10',
    section_number: '4',
    section_name: 'github workflows'
  },
  {
    compliance_check_id: 41,
    code_name: 'noSelfHostedRunners',
    priority_group: 'P10',
    section_number: '4',
    section_name: 'github workflows'
  },
  {
    compliance_check_id: 42,
    code_name: 'noArbitraryCodeInPipeline',
    priority_group: 'P11',
    section_number: '4',
    section_name: 'github workflows'
  },
  {
    compliance_check_id: 43,
    code_name: 'limitWorkflowWritePermissions',
    priority_group: 'P11',
    section_number: '4',
    section_name: 'github workflows'
  },
  {
    compliance_check_id: 44,
    code_name: 'preventScriptInjection',
    priority_group: 'P11',
    section_number: '4',
    section_name: 'github workflows'
  },
  {
    compliance_check_id: 45,
    code_name: 'consistentBuildProcessDocs',
    priority_group: 'P12',
    section_number: '4',
    section_name: 'github workflows'
  },
  {
    compliance_check_id: 46,
    code_name: 'upgradePathDocs',
    priority_group: 'P12',
    section_number: '5',
    section_name: 'vulnerability management'
  },
  {
    compliance_check_id: 47,
    code_name: 'softwareArchitectureDocs',
    priority_group: 'P12',
    section_number: '8',
    section_name: 'code review'
  },
  {
    compliance_check_id: 48,
    code_name: 'ciAndCdPipelineAsCode',
    priority_group: 'P12',
    section_number: '9',
    section_name: 'source control'
  },
  {
    compliance_check_id: 49,
    code_name: 'pinActionsToSHA',
    priority_group: 'P13',
    section_number: '4',
    section_name: 'github workflows'
  },
  {
    compliance_check_id: 50,
    code_name: 'automateDependencyManagement',
    priority_group: 'P14',
    section_number: '10',
    section_name: 'dependency inventory'
  },
  {
    compliance_check_id: 51,
    code_name: 'machineReadableDependencies',
    priority_group: 'P14',
    section_number: '10',
    section_name: 'dependency inventory'
  },
  {
    compliance_check_id: 52,
    code_name: 'identifyModifiedDependencies',
    priority_group: 'P14',
    section_number: '10',
    section_name: 'dependency inventory'
  },
  {
    compliance_check_id: 53,
    code_name: 'annualDependencyRefresh',
    priority_group: 'P14',
    section_number: '5',
    section_name: 'vulnerability management'
  },
  {
    compliance_check_id: 54,
    code_name: 'useHwKeyGithubAccess',
    priority_group: 'R1',
    section_number: '1',
    section_name: 'user authentication'
  },
  {
    compliance_check_id: 55,
    code_name: 'useHwKeyGithubNonInteractive',
    priority_group: 'R1',
    section_number: '1',
    section_name: 'user authentication'
  },
  {
    compliance_check_id: 56,
    code_name: 'useHwKeyOtherContexts',
    priority_group: 'R1',
    section_number: '1',
    section_name: 'user authentication'
  },
  {
    compliance_check_id: 57,
    code_name: 'forkWorkflowApproval',
    priority_group: 'R2',
    section_number: '4',
    section_name: 'github workflows'
  },
  {
    compliance_check_id: 58,
    code_name: 'workflowSecurityScanner',
    priority_group: 'R2',
    section_number: '4',
    section_name: 'github workflows'
  },
  {
    compliance_check_id: 59,
    code_name: 'runnerSecurityScanner',
    priority_group: 'R2',
    section_number: '4',
    section_name: 'github workflows'
  },
  {
    compliance_check_id: 60,
    code_name: 'activeAdminsSixMonths',
    priority_group: 'R3',
    section_number: '2',
    section_name: 'user account permissions'
  },
  {
    compliance_check_id: 61,
    code_name: 'activeWritersSixMonths',
    priority_group: 'R3',
    section_number: '2',
    section_name: 'user account permissions'
  },
  {
    compliance_check_id: 62,
    code_name: 'PRsBeforeMerge',
    priority_group: 'R4',
    section_number: '9',
    section_name: 'source control'
  },
  {
    compliance_check_id: 63,
    code_name: 'commitSignoffForWeb',
    priority_group: 'R4',
    section_number: '9',
    section_name: 'source control'
  },
  {
    compliance_check_id: 64,
    code_name: 'requireSignedCommits',
    priority_group: 'R4',
    section_number: '9',
    section_name: 'source control'
  },
  {
    compliance_check_id: 65,
    code_name: 'includePackageLock',
    priority_group: 'R5',
    section_number: '10',
    section_name: 'dependency inventory'
  },
  {
    compliance_check_id: 66,
    code_name: 'requireTwoPartyReview',
    priority_group: 'R6',
    section_number: '8',
    section_name: 'code review'
  },
  {
    compliance_check_id: 68,
    code_name: 'requirePRApprovalForMainline',
    priority_group: 'R6',
    section_number: '9',
    section_name: 'source control'
  },
  {
    compliance_check_id: 69,
    code_name: 'limitOrgOwners',
    priority_group: 'R7',
    section_number: '2',
    section_name: 'user account permissions'
  },
  {
    compliance_check_id: 70,
    code_name: 'limitRepoAdmins',
    priority_group: 'R7',
    section_number: '2',
    section_name: 'user account permissions'
  },
  {
    compliance_check_id: 71,
    code_name: 'patchExploitableHighVulns14Days',
    priority_group: 'R8',
    section_number: '5',
    section_name: 'vulnerability management'
  },
  {
    compliance_check_id: 72,
    code_name: 'patchExploitableNoncCriticalVulns60Days',
    priority_group: 'R8',
    section_number: '5',
    section_name: 'vulnerability management'
  },
  {
    compliance_check_id: 3,
    code_name: 'githubOrgMFA',
    priority_group: 'P1',
    section_number: '1',
    section_name: 'user authentication'
  },
  {
    compliance_check_id: 1,
    code_name: 'softwareDesignTraining',
    priority_group: 'P0',
    section_number: '7',
    section_name: 'code quality'
  }
]

const checkListsIds = {
  incubating: 1,
  active: 2,
  retiring: 3,
  'solo-incubating': 4,
  'solo-active': 5,
  'solo-retiring': 6
}

const retiringExcludedChecks = [
  'scanCommitsForSensitiveInfo',
  'preventLandingSensitiveCommits',
  'patchCriticalVulns30Days',
  'patchNonCriticalVulns90Days',
  'staticCodeAnalysis',
  'resolveLinterWarnings',
  'staticAppSecTesting',
  'commitStatusChecks',
  'vulnResponse14Days',
  'regressionTestsForVulns',
  'defaultTokenPermissionsReadOnly',
  'restrictOrgSecrets',
  'verifiedActionsOnly',
  'noArbitraryCodeInPipeline',
  'preventScriptInjection',
  'consistentBuildProcessDocs',
  'upgradePathDocs',
  'softwareArchitectureDocs',
  'ciAndCdPipelineAsCode',
  'pinActionsToSHA',
  'annualDependencyRefresh',
  'activeAdminsSixMonths',
  'activeWritersSixMonths',
  'requireTwoPartyReview',
  'requireCodeOwnersReviewForLargeTeams',
  'patchExploitableHighVulns14Days',
  'patchExploitableNoncCriticalVulns60Days'
]

const soloMaintainerExcludedChecks = [
  'preventBranchProtectionBypass',
  'twoOrMoreOwnersForAccess',
  'softwareArchitectureDocs',
  'requireTwoPartyReview',
  'requirePRApprovalForMainline'
]

// IMPORTANT: Deferrable items are included, only N/A items are excluded
const activeChecks = checks.map(check => ({ ...check, checklist_id: checkListsIds.active }))
const incubatingChecks = checks.map(check => ({ ...check, checklist_id: checkListsIds.incubating }))
const retiringChecks = checks
  .filter(check => !retiringExcludedChecks.includes(check.code_name))
  .map(check => ({ ...check, checklist_id: checkListsIds.retiring }))

const soloActiveChecks = activeChecks
  .filter(check => !soloMaintainerExcludedChecks.includes(check.code_name))
  .map(check => ({ ...check, checklist_id: checkListsIds['solo-active'] }))
const soloIncubatingChecks = incubatingChecks
  .filter(check => !soloMaintainerExcludedChecks.includes(check.code_name))
  .map(check => ({ ...check, checklist_id: checkListsIds['solo-incubating'] }))
const soloRetiringChecks = retiringChecks
  .filter(check => !soloMaintainerExcludedChecks.includes(check.code_name))
  .map(check => ({ ...check, checklist_id: checkListsIds['solo-retiring'] }))

const list = [
  ...activeChecks,
  ...incubatingChecks,
  ...retiringChecks,
  ...soloActiveChecks,
  ...soloIncubatingChecks,
  ...soloRetiringChecks
] // Remove unused properties
  .map(({ code_name: codeName, ...rest }) => rest)

exports.up = async (knex) => {
  await knex('checklist_items').insert(list)
}

exports.down = async (knex) => {
  await knex('checklist_items').del()
}
