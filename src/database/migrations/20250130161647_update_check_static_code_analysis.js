exports.up = async (knex) => {
  await knex('compliance_checks')
    .where({ code_name: 'staticCodeAnalysis' })
    .update({
      implementation_status: 'completed',
      implementation_type: 'computed',
      implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/83'
    })
}

exports.down = async (knex) => {
  await knex('compliance_checks')
    .where({ code_name: 'staticCodeAnalysis' })
    .update({
      implementation_status: 'pending',
      implementation_type: null,
      implementation_details_reference: null
    })
}
