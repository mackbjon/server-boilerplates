exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('todo')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('todo').insert([
        { id: 1, task: 'Create API' },
        { id: 2, task: 'Eat food!!!' },
        { id: 3, task: 'Love bay!' },
        { id: 4, task: 'please please plase' },
      ])
    })
}
