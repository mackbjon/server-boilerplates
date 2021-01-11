import app, { gqlPath } from './app'
import http from 'http'
import { PORT } from './utils/config'

const server = http.createServer(app)

server.listen(PORT, () => {
  if (PORT === 4000) {
    console.log('Server is ready at http://localhost:4000')
    console.log(`GraphQL route at http://localhost:4000${gqlPath}`)
  }
})
