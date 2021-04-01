import express from 'express'
import Queue from 'bull'
import db from './data/db'

// Connect to a local redis intance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

// Create / Connect to a named work queue
let workQueue = new Queue('work', REDIS_URL)

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, ld!')
})

app.get('/todo', async (req, res) => {
  const todos = await db('todo')
  console.log(todos)
  res.json({ todos })
})

app.post('/job', async (req, res) => {
  // This would be where you could pass arguments to the job
  // Ex: workQueue.add({ url: 'https://www.heroku.com' })
  // Docs: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd
  console.log(req.body.url)
  let job = await workQueue.add()
  res.json({ id: job.id })
})

// You can listen to global events to get notified when jobs are processed
workQueue.on('global:completed', (jobId, result) => {
  console.log(`Job (${jobId}) completed with result ${result}`)
})

export default app
