const { readdirSync } = require('fs')
const { join } = require('path')
const debug = require('debug')('checks:index')
const genericProjectPolicyComplianceCheck = require('./complianceChecks/genericProjectPolicyComplianceCheck')

// This will load all the files in the complianceChecks directory and export them as an object. It works similar to require-all
debug('Loading compliance check files...')
const checksPath = join(__dirname, 'complianceChecks')
const files = readdirSync(checksPath)
const jsFiles = files.filter(file => file.endsWith('.js') && file !== 'genericProjectPolicyComplianceCheck.js')
const checks = {}
for (const file of jsFiles) {
  debug(`Loading ${file}...`)
  const [fileName] = file.split('.')
  const fileContent = require(join(checksPath, file))
  checks[fileName] = fileContent
}

debug('Checks files loaded')

// Generic Policies
checks.defineFunctionalRoles = genericProjectPolicyComplianceCheck('defineFunctionalRoles')
checks.orgToolingMFA = genericProjectPolicyComplianceCheck('orgToolingMFA')
checks.softwareArchitectureDocs = genericProjectPolicyComplianceCheck('softwareArchitectureDocs')
checks.MFAImpersonationDefense = genericProjectPolicyComplianceCheck('MFAImpersonationDefense')
checks.includeCVEInReleaseNotes = genericProjectPolicyComplianceCheck('includeCVEInReleaseNotes')
checks.assignCVEForKnownVulns = genericProjectPolicyComplianceCheck('assignCVEForKnownVulns')
checks.incidentResponsePlan = genericProjectPolicyComplianceCheck('incidentResponsePlan')
checks.regressionTestsForVulns = genericProjectPolicyComplianceCheck('regressionTestsForVulns')
checks.vulnResponse14Days = genericProjectPolicyComplianceCheck('vulnResponse14Days')
checks.useCVDToolForVulns = genericProjectPolicyComplianceCheck('useCVDToolForVulns')
checks.securityMdMeetsOpenJSCVD = genericProjectPolicyComplianceCheck('securityMdMeetsOpenJSCVD')
checks.consistentBuildProcessDocs = genericProjectPolicyComplianceCheck('consistentBuildProcessDocs')
checks.machineReadableDependencies = genericProjectPolicyComplianceCheck('machineReadableDependencies')
checks.identifyModifiedDependencies = genericProjectPolicyComplianceCheck('identifyModifiedDependencies')
checks.ciAndCdPipelineAsCode = genericProjectPolicyComplianceCheck('ciAndCdPipelineAsCode')
checks.npmOrgMFA = genericProjectPolicyComplianceCheck('npmOrgMFA')
checks.npmPublicationMFA = genericProjectPolicyComplianceCheck('npmPublicationMFA')
checks.upgradePathDocs = genericProjectPolicyComplianceCheck('upgradePathDocs')
checks.patchNonCriticalVulns90Days = genericProjectPolicyComplianceCheck('patchNonCriticalVulns90Days')
checks.patchCriticalVulns30Days = genericProjectPolicyComplianceCheck('patchCriticalVulns30Days')
checks.twoOrMoreOwnersForAccess = genericProjectPolicyComplianceCheck('twoOrMoreOwnersForAccess')
checks.injectedSecretsAtRuntime = genericProjectPolicyComplianceCheck('injectedSecretsAtRuntime')
checks.preventScriptInjection = genericProjectPolicyComplianceCheck('preventScriptInjection')
checks.resolveLinterWarnings = genericProjectPolicyComplianceCheck('resolveLinterWarnings')
checks.annualDependencyRefresh = genericProjectPolicyComplianceCheck('annualDependencyRefresh')

debug('Generic Policies loaded')

module.exports = checks
