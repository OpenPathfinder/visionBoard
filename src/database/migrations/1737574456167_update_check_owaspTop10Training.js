exports.up = async (knex) => {
  await knex('compliance_checks')
    .where({ code_name: 'owaspTop10Training' })
    .update({
      implementation_status: 'completed',
      implementation_type: 'manual',
      implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/63'
    })
}

exports.down = async (knex) => {
  await knex('compliance_checks')
    .where({ code_name: 'owaspTop10Training' })
    .update({
      implementation_status: 'pending',
      implementation_type: null,
      implementation_details_reference: null
    })
}
