exports.up = function (knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary()
      table
        .uuid('userUuid')
        .defaultTo(knex.raw('uuid_generate_v1mc()'))
        .index()
        .unique()
      table.timestamps(false, true)
      table.timestamp('lastLogin')
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
    })
    .createTable('domains', table => {
      table.increments('id').primary()
      table.string('root').notNullable().unique()
      table.string('priceId')
      table.string('priceClass')
      table.string('cartVal')
      table.string('cartId')
      table.string('cartClass')
      table.integer('priceErrors')
      table.integer('cartErrors')
    })
    .createTable('products', table => {
      table.increments('id').primary()
      table
        .uuid('prodUuid')
        .defaultTo(knex.raw('uuid_generate_v1mc()'))
        .index()
        .unique()
      table.timestamps(false, true)
      table.string('name')
      table.string('img')
      table.string('altImg')
      table.string('altImg2')
      table.string('url').notNullable().unique()
      table.boolean('useJs').defaultTo(false)
      table.integer('domId').unsigned().notNullable()
      table
        .foreign('domId')
        .references('id')
        .inTable('domains')
        .onDelete('CASCADE')
    })
    .createTable('prodInfo', table => {
      table.uuid('id').defaultTo(knex.raw('uuid_generate_v1mc()')).primary()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.boolean('inStock')
      table.float('price')
      table.integer('prodId').unsigned().notNullable()
      table
        .foreign('prodId')
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
    })
    .createTable('jobs', table => {
      table.increments('id').primary()
      table
        .uuid('jobUuid')
        .defaultTo(knex.raw('uuid_generate_v1mc()'))
        .index()
        .unique()
      table.string('name')
      table.timestamps(false, true)
      table.timestamp('expires').notNullable().defaultTo(knex.fn.now())
      table.boolean('stockAlert').defaultTo(false)
      table.float('priceAlert')
      table.timestamp('lastStockAlert')
      table.timestamp('lastPriceAlert')
      table.integer('userId').unsigned().notNullable()
      table
        .foreign('userId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('prodId').unsigned().notNullable()
      table
        .foreign('prodId')
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('jobs')
    .dropTableIfExists('prodInfo')
    .dropTableIfExists('products')
    .dropTableIfExists('domains')
    .dropTableIfExists('users')
}
