const { logger } = require('../utils')
const { initializeStore } = require('../store')
const { simplifyObject } = require('@ulisesgascon/simplify-object')
const { bulkImportSchema } = require('../schemas')

const projectPolicies = ['defineFunctionalRoles', 'orgToolingMFA', 'softwareArchitectureDocs', 'MFAImpersonationDefense', 'includeCVEInReleaseNotes', 'assignCVEForKnownVulns', 'incidentResponsePlan', 'regressionTestsForVulns', 'vulnResponse14Days', 'useCVDToolForVulns', 'securityMdMeetsOpenJSCVD', 'consistentBuildProcessDocs', 'machineReadableDependencies', 'identifyModifiedDependencies', 'ciAndCdPipelineAsCode', 'npmOrgMFA', 'npmPublicationMFA', 'upgradePathDocs', 'upgradePathDocs', 'patchNonCriticalVulns90Days', 'patchCriticalVulns30Days', 'twoOrMoreOwnersForAccess', 'injectedSecretsAtRuntime', 'preventScriptInjection', 'resolveLinterWarnings', 'annualDependencyRefresh']

const bulkImport = async ({ operationId, knex, data }) => {
  // Note: data is validated in the API router
  logger.info('Bulk importing data...')

  const { upsertSoftwareDesignTraining, upsertOwaspTop10Training, upsertProjectPolicies } = initializeStore(knex)

  // @TODO: Support other operations
  if (operationId !== 'load-manual-checks') {
    throw new Error('Invalid operation')
  }

  // Update the database
  for await (const item of data) {
    let result

    if (item.type === 'softwareDesignTraining') {
      logger.info('Upserting software design training data...')
      result = await upsertSoftwareDesignTraining(simplifyObject(item, {
        exclude: ['type']
      }))
    } else if (item.type === 'owaspTop10Training') {
      logger.info('Upserting OWASP Top 10 training data...')
      result = await upsertOwaspTop10Training(simplifyObject(item, {
        exclude: ['type']
      }))
    } else if (projectPolicies.includes(item.type)) {
      logger.info(`Upserting project policy ${item.type}...`)
      result = await upsertProjectPolicies(item.project_id, {
        [`has_${item.type}_policy`]: item.is_subscribed
      })
    }

    // Check if the operation was successful
    if (!result || result.length === 0) {
      throw new Error(`Operation failed for item type: ${item.type}, project_id: ${item.project_id}`)
    }
  }

  logger.info('Bulk importing completed')
  return { success: true }
}

const getAllBulkImportOperations = () => {
  return [
    {
      id: 'load-manual-checks',
      description: 'Load manual checks from project policies',
      schema: JSON.stringify(bulkImportSchema)
    }
  ]
}

module.exports = {
  bulkImport,
  getAllBulkImportOperations
}
