import pgconstring from 'pg-connection-string'

const parse = pgconstring.parse

export const REDIS_URL = process.env.REDIS_URL || process.env.TEST_REDIS_URL

export const POSTGRES_URI =
  process.env.DATABASE_URL || process.env.TEST_DATABASE_URL

export const { user, password, host, database } = parse(POSTGRES_URI)

export const PORT = parseInt(process.env.PORT)

export const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}
