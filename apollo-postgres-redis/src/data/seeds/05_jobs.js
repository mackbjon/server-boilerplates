exports.seed = function (knex) {
  // Deletes ALL existing entries
  const time = new Date()
  time.setDate(time.getDate() + 30)
  return knex('jobs').then(function () {
    // Inserts seed entries
    return knex('jobs').insert([
      {
        expires: time.toISOString(),
        priceAlert: 250,
        userId: 1,
        prodId: 1,
      },
      {
        expires: time.toISOString(),
        priceAlert: 50,
        userId: 1,
        prodId: 2,
      },
    ])
  })
}
