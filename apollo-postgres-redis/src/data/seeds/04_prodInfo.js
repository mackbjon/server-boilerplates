exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('prodInfo').then(function () {
    // Inserts seed entries
    return knex('prodInfo').insert([
      { inStock: true, price: 299.95, prodId: 1 },
      { inStock: true, price: 299.95, prodId: 1 },
      { inStock: true, price: 299.95, prodId: 1 },
      { inStock: false, price: 299.95, prodId: 1 },
      { inStock: true, price: 79.99, prodId: 2 },
      { inStock: false, price: 79.99, prodId: 2 },
      { inStock: true, price: 79.99, prodId: 2 },
      { inStock: true, price: 49.99, prodId: 2 },
    ])
  })
}
