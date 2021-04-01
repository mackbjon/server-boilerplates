exports.up = function (knex) {
  return knex.schema.createTable('todo', tbl => {
    tbl.increments()
    tbl.text('task').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('todo')
}
