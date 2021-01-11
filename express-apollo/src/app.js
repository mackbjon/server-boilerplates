import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import db from './data/db'

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

const app = express()

server.applyMiddleware({ app })

export const gqlPath = server.graphqlPath

app.get('/', (req, res) => {
  res.send('Hello, Express!')
})

app.get('/todo', async (req, res) => {
  const todos = await db('todo')
  console.log(todos)
  res.json({ todos })
})

export default app
