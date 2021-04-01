import { user, password, host, database, POSTGRES_URI } from '../utils/config'

const config = {
  development: {
    client: 'pg',
    connection: {
      host,
      user,
      password,
      database,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      directory: './migrations',
    },
    seeds: { directory: './seeds' },
  },

  production: {
    client: 'pg',
    connection: POSTGRES_URI,
    migrations: {
      directory: './migrations',
    },
    seeds: { directory: './seeds' },
  },
}

export default config
