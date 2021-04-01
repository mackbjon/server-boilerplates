import throng from 'throng'
import Queue from 'bull'
import { REDIS_URL } from '../utils/config'

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
const numWorkers = process.env.WEB_CONCURRENCY || 1

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 50

function start(id) {
  console.log(`Started worker ${id}`)
  // Connect to the named work queue
  let workQueue = new Queue('work', REDIS_URL)

  workQueue.process('dataReToPg', maxJobsPerWorker, async () => {
    // console.log(job)
    return { id: 'dataReToPg' }
  })
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ worker: start, count: numWorkers })
