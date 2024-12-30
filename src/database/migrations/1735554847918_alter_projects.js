const categories = ['impact', 'at-large', 'incubation', 'emeritus']

exports.up = async (knex) => {
  await knex.schema.alterTable('projects', (table) => {
    table.dropColumn('category')
  })
}

exports.down = async (knex) => {
  await knex.schema.alterTable('projects', (table) => {
    // IMPORTANT: Re-add category field but without the original values and nullable.
    table.enum('category', categories).nullable()
  })
}
