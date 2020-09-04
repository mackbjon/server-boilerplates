import pgconstring from 'pg-connection-string'

const parse = pgconstring.parse

export const POSTGRES_URI = process.env.DATABASE_URL

export const { user, password, host, database } = parse(POSTGRES_URI)

export const PORT = parseInt(process.env.PORT)
