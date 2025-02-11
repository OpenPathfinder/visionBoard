const checks = [
  {
    code_name: 'defineFunctionalRoles',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/77'
  }, {
    code_name: 'orgToolingMFA',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/65'
  }, {
    code_name: 'softwareArchitectureDocs',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/107'
  }, {
    code_name: 'MFAImpersonationDefense',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/66'
  }, {
    code_name: 'includeCVEInReleaseNotes',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/92'
  }, {
    code_name: 'assignCVEForKnownVulns',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/91'
  }, {
    code_name: 'incidentResponsePlan',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/90'
  }, {
    code_name: 'regressionTestsForVulns',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/93'
  }, {
    code_name: 'vulnResponse14Days',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/89'
  }, {
    code_name: 'useCVDToolForVulns',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/88'
  }, {
    code_name: 'securityMdMeetsOpenJSCVD',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/87'
  }, {
    code_name: 'consistentBuildProcessDocs',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/105'
  }, {
    code_name: 'machineReadableDependencies',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/110'
  }, {
    code_name: 'identifyModifiedDependencies',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/111'
  }, {
    code_name: 'ciAndCdPipelineAsCode',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/108'
  }, {
    code_name: 'npmOrgMFA',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/64'
  }, {
    code_name: 'npmPublicationMFA',
    implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/72'
  }
]

exports.up = async (knex) => {
  await Promise.all(checks.map(async check => knex('compliance_checks')
    .where({ code_name: check.code_name })
    .update({
      implementation_status: 'completed',
      implementation_type: 'manual',
      implementation_details_reference: check.implementation_details_reference
    })
  ))
}

exports.down = async (knex) => {
  await Promise.all(checks.map(async check => knex('compliance_checks')
    .where({ code_name: check.code_name })
    .update({
      implementation_status: 'pending',
      implementation_type: null,
      implementation_details_reference: null
    })
  ))
}
