exports.up = async (knex) => {
  await knex.schema.createTable('resources_for_compliance_checks', table => {
    table.increments()
    table.integer('compliance_check_id')
      .unsigned()
      .notNullable()
      .references('id').inTable('compliance_checks').onDelete('CASCADE').onUpdate('CASCADE')
    table.integer('compliance_check_resource_id')
      .unsigned()
      .notNullable()
      .references('id').inTable('compliance_checks_resources').onDelete('CASCADE').onUpdate('CASCADE')

    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('resources_for_compliance_checks')
}
