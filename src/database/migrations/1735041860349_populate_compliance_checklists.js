const list = [
  {
    id: 1,
    author: 'OpenJS Foundation',
    title: 'Security Compliance Guide v1.0 - Incubating',
    description: 'This checklist is for projects that are in the incubating phase and have multiple maintainers.',
    url: 'https://openpathfinder.com/docs/checklists/OpenJS-SCGv1.0-incubating',
    code_name: 'OpenJS-SCGv1.0-incubating'
  }, {
    id: 2,
    author: 'OpenJS Foundation',
    title: 'Security Compliance Guide v1.0 - Active',
    description: 'This checklist is for projects that are in the active phase and have multiple maintainers.',
    url: 'https://openpathfinder.com/docs/checklists/OpenJS-SCGv1.0-active',
    code_name: 'OpenJS-SCGv1.0-active'
  }, {
    id: 3,
    author: 'OpenJS Foundation',
    title: 'Security Compliance Guide v1.0 - Retiring',
    description: 'This checklist is for projects that are in the retiring phase and have multiple maintainers.',
    url: 'https://openpathfinder.com/docs/checklists/OpenJS-SCGv1.0-retiring',
    code_name: 'OpenJS-SCGv1.0-retiring'
  }, {
    id: 4,
    author: 'OpenJS Foundation',
    title: 'Security Compliance Guide v1.0 - Solo Maintainers incubating',
    description: 'This checklist is for projects that are in the incubating phase and have a solo maintainer.',
    url: 'https://openpathfinder.com/docs/checklists/OpenJS-SCGv1.0-solo-incubating',
    code_name: 'OpenJS-SCGv1.0-solo-incubating'
  }, {
    id: 5,
    author: 'OpenJS Foundation',
    title: 'Security Compliance Guide v1.0 - Solo Maintainers Active',
    description: 'This checklist is for projects that are in the active phase and have a solo maintainer.',
    url: 'https://openpathfinder.com/docs/checklists/OpenJS-SCGv1.0-solo-active',
    code_name: 'OpenJS-SCGv1.0-solo-active'
  }, {
    id: 6,
    author: 'OpenJS Foundation',
    title: 'Security Compliance Guide v1.0 - Solo Maintainers Retiring',
    description: 'This checklist is for projects that are in the retiring phase and have a solo maintainer.',
    url: 'https://openpathfinder.com/docs/checklists/OpenJS-SCGv1.0-solo-retiring',
    code_name: 'OpenJS-SCGv1.0-solo-retiring'
  }
]

exports.up = async (knex) => {
  await knex('compliance_checklists').insert(list)
}

exports.down = async (knex) => {
  await knex('compliance_checklists').del()
}
