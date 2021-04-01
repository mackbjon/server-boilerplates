exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('products').then(function () {
    // Inserts seed entries
    return knex('products').insert([
      {
        name: 'VEXXON Bat',
        url: 'amazon.com/baseball_bat',
        domId: 1,
      },
      {
        name: 'Patriots Jersey',
        url: 'ebay.com/baseball_bat',
        domId: 2,
      },
    ])
  })
}
