const githubOrgMFA = require('./githubOrgMFA')
const softwareDesignTraining = require('./softwareDesignTraining')
const owaspTop10Training = require('./owaspTop10Training')
const adminRepoCreationOnly = require('./adminRepoCreationOnly')
const noSensitiveInfoInRepositories = require('./noSensitiveInfoInRepositories')
const genericProjectPolicyValidator = require('./genericProjectPolicyValidator')

const validators = {
  githubOrgMFA,
  softwareDesignTraining,
  owaspTop10Training,
  adminRepoCreationOnly,
  noSensitiveInfoInRepositories,
  // Generic Policies
  defineFunctionalRoles: genericProjectPolicyValidator('defineFunctionalRoles'),
  orgToolingMFA: genericProjectPolicyValidator('orgToolingMFA'),
  softwareArchitectureDocs: genericProjectPolicyValidator('softwareArchitectureDocs'),
  MFAImpersonationDefense: genericProjectPolicyValidator('MFAImpersonationDefense'),
  includeCVEInReleaseNotes: genericProjectPolicyValidator('includeCVEInReleaseNotes'),
  assignCVEForKnownVulns: genericProjectPolicyValidator('assignCVEForKnownVulns'),
  incidentResponsePlan: genericProjectPolicyValidator('incidentResponsePlan'),
  regressionTestsForVulns: genericProjectPolicyValidator('regressionTestsForVulns'),
  vulnResponse14Days: genericProjectPolicyValidator('vulnResponse14Days'),
  useCVDToolForVulns: genericProjectPolicyValidator('useCVDToolForVulns'),
  securityMdMeetsOpenJSCVD: genericProjectPolicyValidator('securityMdMeetsOpenJSCVD'),
  consistentBuildProcessDocs: genericProjectPolicyValidator('consistentBuildProcessDocs'),
  machineReadableDependencies: genericProjectPolicyValidator('machineReadableDependencies'),
  identifyModifiedDependencies: genericProjectPolicyValidator('identifyModifiedDependencies'),
  ciAndCdPipelineAsCode: genericProjectPolicyValidator('ciAndCdPipelineAsCode'),
  npmOrgMFA: genericProjectPolicyValidator('npmOrgMFA'),
  npmPublicationMFA: genericProjectPolicyValidator('npmPublicationMFA'),
  upgradePathDocs: genericProjectPolicyValidator('upgradePathDocs'),
  patchNonCriticalVulns90Days: genericProjectPolicyValidator('patchNonCriticalVulns90Days'),
  patchCriticalVulns30Days: genericProjectPolicyValidator('patchCriticalVulns30Days'),
  twoOrMoreOwnersForAccess: genericProjectPolicyValidator('twoOrMoreOwnersForAccess'),
  injectedSecretsAtRuntime: genericProjectPolicyValidator('injectedSecretsAtRuntime'),
  preventScriptInjection: genericProjectPolicyValidator('preventScriptInjection'),
  resolveLinterWarnings: genericProjectPolicyValidator('resolveLinterWarnings'),
  annualDependencyRefresh: genericProjectPolicyValidator('annualDependencyRefresh')
}

module.exports = validators
