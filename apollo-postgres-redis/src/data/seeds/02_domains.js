exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('domains').then(function () {
    // Inserts seed entries
    return knex('domains').insert([
      {
        root: 'amazon.com',
        priceId: 'priceblock_ourprice',
        cartId: 'add-to-cart-button',
      },
      {
        root: 'ebay.com',
        priceClass: 'prcevalnow',
        cartId: 'addtocartbutton',
      },
    ])
  })
}
