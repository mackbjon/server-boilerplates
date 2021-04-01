import knex from 'knex'

import knexfile from './knexfile'

const env = process.env.NODE_ENV

const db = knex(knexfile[env])

export default db
