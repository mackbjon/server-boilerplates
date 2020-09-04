import express from 'express'

import db from './data/db'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.get('/todo', async (req, res) => {
  const todos = await db('todo')
  console.log(todos)
  res.json({ todos })
})

export default app
