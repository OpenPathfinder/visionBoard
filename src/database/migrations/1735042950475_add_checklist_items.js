const priorityGroupOptions = [
  'P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14',
  'R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14'
]

exports.up = async (knex) => {
  await knex.schema.createTable('checklist_items', (table) => {
    table.increments('id').primary() // Primary key
    table.integer('checklist_id').unsigned().notNullable() // Foreign key to compliance_checklists
    table.foreign('checklist_id').references('id').inTable('compliance_checklists').onDelete('CASCADE')

    table.integer('compliance_check_id').unsigned().notNullable() // Foreign key to compliance_checks
    table.foreign('compliance_check_id').references('id').inTable('compliance_checks').onDelete('CASCADE')

    // Overrides for the association if needed
    table.enum('priority_group', priorityGroupOptions).nullable()
    table.string('section_number').nullable()
    table.string('section_name').nullable()

    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })

  // Add trigger to automatically update the 'updated_at' column
  await knex.raw(`
        CREATE TRIGGER set_updated_at_checklist_items
        BEFORE UPDATE ON checklist_items
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `)
}

exports.down = async (knex) => {
  // Drop trigger
  await knex.raw('DROP TRIGGER IF EXISTS set_updated_at_checklist_items ON checklist_items;')
  // Drop table
  await knex.schema.dropTableIfExists('checklist_items')
}
