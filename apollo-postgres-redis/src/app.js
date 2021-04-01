import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ApolloServer, gql, UserInputError } from 'apollo-server-express'
import { setQueues, BullAdapter, router } from 'bull-board'
import Queue from 'bull'
import { v1 as uuidv1 } from 'uuid'
import { corsOptions, REDIS_URL, POSTGRES_URI } from './utils/config'
import redis from './data/redis/db'
import { seedRedis } from './data/redis/seedRe'
import { transferToDB } from './data/redis/cache/index'

// App/server connections below:

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: POSTGRES_URI,
    },
  },
})

let workQueue = new Queue('work', REDIS_URL)

setQueues([new BullAdapter(workQueue)])

// gql server logic

const typeDefs = gql`
  type User {
    userUuid: ID!
    email: String!
    created_at: String!
    updated_at: String!
    lastLogin: String
    jobs: [Job]
  }

  type Job {
    jobUuid: ID!
    created_at: String!
    updated_at: String!
    expires: String!
    product: Product
  }

  type Product {
    prodUuid: ID!
    name: String
    url: String!
    img: String
    useJs: Boolean!
    prodInfo: [prodInfo]
  }

  type prodInfo {
    id: ID!
    created_at: String!
    inStock: Boolean
    price: Float
  }

  type Query {
    allUsers: [User]!
    findUser(email: String!): User
  }

  type Mutation {
    addJob(
      userId: Int!
      url: String!
      root: String!
      priceId: String
      cartId: String
      stockAlert: Boolean
      priceAlert: Float
      useJs: Boolean
    ): Job
    removeJob(id: ID!): Boolean
  }
`

const resolvers = {
  Query: {
    findUser: (parent, args) => {
      return prisma.users.findUnique({
        where: {
          email: args.email,
        },
      })
    },
    allUsers: () => {
      return prisma.users.findMany()
    },
  },
  Mutation: {
    addJob: async (parent, args) => {
      const {
        userId,
        url,
        root,
        priceId,
        cartId,
        stockAlert,
        priceAlert,
        cartVal,
      } = args

      if (!stockAlert && !priceAlert) {
        throw new UserInputError(
          'Must provide either a price alert or in-stock alert'
        )
      }

      const upsertDomain = await prisma.domains.upsert({
        where: {
          root,
        },
        update: {
          root,
        },
        create: {
          root,
          priceId: priceId ? priceId : null,
          cartId: cartId ? cartId : null,
          cartVal: cartVal ? cartVal : null,
        },
      })

      if (upsertDomain.priceId !== priceId || upsertDomain.cartId !== cartId) {
        console.log(`Mismatch between domain price/cart identifiers! db priceId = ${upsertDomain.priceId}
         - inputted priceId = ${priceId} --- db cartId = ${upsertDomain.cartId}
         - inputted cartId = ${cartId}`)
      }

      const upsertProd = await prisma.products.upsert({
        where: {
          url,
        },
        update: {
          url,
        },
        create: {
          url,
          domId: upsertDomain.id,
        },
      })

      console.log(upsertProd)

      console.log(upsertDomain)

      const data = {
        userId,
        prodId: upsertProd.id,
        stockAlert: stockAlert ? stockAlert : false,
        priceAlert: priceAlert ? priceAlert : null,
      }

      const now = new Date()
      const expTime = new Date()
      expTime.setMinutes(expTime.getMinutes() + 10)
      data.expires = expTime

      const limit = (expTime.getTime() - now.getTime()) / 10000

      const createJob = await prisma.jobs.create({
        data,
      })

      console.log(createJob)

      const newJobRedis = {}

      for (const [key, value] of Object.entries(createJob)) {
        if (value) {
          if (key !== 'jobUuid') {
            newJobRedis[key] = value
          }
        }
      }

      await redis.hmset(createJob.jobUuid, newJobRedis)

      await workQueue.add(
        'mainProductRepeat',
        {
          url,
          jobUuid: [createJob.jobUuid],
          priceSelector: ['id', priceId],
          cartSelector: ['id', cartId],
        },
        {
          jobId: createJob.jobUuid,
          repeat: {
            limit,
            every: 10000,
          },
        }
      )

      return createJob
    },

    removeJob: async (parent, args) => {
      workQueue.removeRepeatableByKey(`__default__:${args.id}::10000`)
      await prisma.jobs.delete({
        where: { jobUuid: args.id },
      })

      return true
    },
  },
  User: {
    jobs: parent => {
      return prisma.jobs.findMany({
        where: {
          userId: parent.id,
        },
      })
    },
  },
  Job: {
    product: parent => {
      if (!parent.prodId) {
        return null
      }
      if (parent.product) {
        return parent.product
      }
      return prisma.products.findUnique({
        where: {
          id: parent.prodId,
        },
      })
    },
  },
  Product: {
    prodInfo: async parent => {
      let date
      let prismaObj = {
        orderBy: {
          created_at: 'asc',
        },
        where: {
          prodId: parent.id,
        },
      }
      const data = []
      const set = await redis.zrange(parent.id, 0, -1)
      if (set.length) {
        let flag = true
        for (const d of set) {
          const obj = await redis.hgetall(d)
          if (flag) {
            date = obj.created_at
            flag = false
          }
          obj.created_at = Date.parse(obj.created_at)
          data.push(obj)
        }
        prismaObj = {
          ...prismaObj,
          where: {
            ...prismaObj.where,
            created_at: {
              lte: date,
            },
          },
        }
      }
      const arr2 = await prisma.prodInfo.findMany(prismaObj)
      data.unshift(...arr2)
      return data
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

// express server only below:

const app = express()

if (process.env.NODE_ENV === 'development') {
  server.applyMiddleware({ app, cors: corsOptions })
} else {
  server.applyMiddleware({ app })
}

export const gqlPath = server.graphqlPath

app.use(express.static('build'))

app.use(express.json())

// bull worker UI via bull-board
app.use('/admin/queues', router)

app.get('/', (req, res) => {
  res.send('Hello, ld!')
})

app.post('/admin/seed', async (req, res) => {
  try {
    await seedRedis()
    const data = []
    const set = await redis.zrange('1', 0, -1)
    for (const d of set) {
      const obj = await redis.hgetall(d)
      data.push(obj)
    }
    const set2 = await redis.zrange('2', 0, -1)
    for (const d of set2) {
      const obj = await redis.hgetall(d)
      data.push(obj)
    }
    res.json(data)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.post('/admin/xfer', async (req, res) => {
  try {
    const result = await transferToDB()
    res.json(result)
  } catch (error) {
    console.log(error)
  }
})

// You can listen to global events to get notified when jobs are processed
workQueue.on('global:completed', async (jobId, result) => {
  const resultParsed = JSON.parse(result)
  if (resultParsed.id === 'dataReToPg') {
    transferToDB()
  }
})

export const initializeDataXfer = async () => {
  const repeatJobs = await workQueue.getRepeatableJobs()
  if (repeatJobs.length) {
    for (const o of repeatJobs) {
      if (o.name === 'dataReToPg') {
        await workQueue.removeRepeatableByKey(o.key)
        console.log('Previous dataReToPg Removed')
      }
    }
  }
  const jobId = uuidv1()
  await workQueue.add(
    'dataReToPg',
    { jobUuid: jobId },
    {
      jobId,
      repeat: {
        every: 30000,
      },
      removeOnComplete: true,
    }
  )
  console.log('dataReToPg Job Added')
  return
}

export default app
