exports.seed = async function (knex) {
  // Deletes ALL existing entries
  const tables = ['products', 'domains', 'users']

  await Promise.all(
    tables.map(table =>
      knex.raw(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`)
    )
  )

  return knex('users').then(function () {
    // Inserts seed entries
    const now = new Date()
    return knex('users').insert([
      {
        lastLogin: now.toISOString(),
        email: 'jmack',
        password: 'notonyourlifelol',
      },
      {
        lastLogin: now.toISOString(),
        email: 'lanette',
        password: 'iloveher',
      },
    ])
  })
}
