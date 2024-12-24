const { writeFileSync } = require('fs')
const { getConfig } = require('../src/config')
const { dbSettings } = getConfig()
const knex = require('knex')(dbSettings)
const { join } = require('path');

(async () => {
  try {
    const query = `
      SELECT
        cl.id,
        cl.author,
        cl.title,
        cl.description,
        cl.code_name,
        cl.url,
        cl.created_at,
        cl.updated_at,
        COALESCE(json_agg(
          json_build_object(
            'id', ci.id,
            'code_name', cc.code_name,
            'title', cc.title,
            'description', cc.description,
            'priority_group', COALESCE(ci.priority_group, cc.default_priority_group),
            'section_number', COALESCE(ci.section_number, cc.default_section_number),
            'section_name', COALESCE(ci.section_name, cc.default_section_name),
            'details_url', cc.details_url,
            'created_at', cc.created_at,
            'updated_at', cc.updated_at
          )
        ) FILTER (WHERE ci.id IS NOT NULL), '[]') AS checks
      FROM public.compliance_checklists cl
      LEFT JOIN public.checklist_items ci ON cl.id = ci.checklist_id
      LEFT JOIN public.compliance_checks cc ON ci.compliance_check_id = cc.id
      GROUP BY cl.id
      ORDER BY cl.id;
    `

    // Execute the raw query
    const result = await knex.raw(query)

    // Write the result to a JSON file
    const outputPath = join(process.cwd(), 'output', 'checklists.json')
    writeFileSync(outputPath, JSON.stringify(result.rows, null, 2))

    console.log(`Data exported to ${outputPath}`)
  } catch (error) {
    console.error('Error exporting data:', error.message)
  } finally {
    await knex.destroy()
  }
})()
