import { v1 as uuidv1 } from 'uuid'
import redis from './db'

export const seedRedis = async () => {
  const data = [
    { inStock: true, price: 349.9, prodId: 1 },
    { inStock: true, price: 399.9, prodId: 1 },
    { inStock: true, price: 299.95, prodId: 1 },
    { inStock: false, price: 399.9, prodId: 1 },
    { inStock: true, price: 39.99, prodId: 2 },
    { inStock: false, price: 39.99, prodId: 2 },
    { inStock: true, price: 59.99, prodId: 2 },
    { inStock: true, price: 69.99, prodId: 2 },
  ]
  const prodIds = []
  for (const d of data) {
    try {
      const prodInfoId = uuidv1()
      const createdAt = new Date()
      let inStock
      if (d.inStock) {
        inStock = '1'
      } else {
        inStock = '0'
      }
      await redis
        .multi()
        .hset(
          prodInfoId,
          'id',
          prodInfoId,
          'inStock',
          inStock,
          'price',
          d.price,
          'prodId',
          d.prodId,
          'created_at',
          createdAt.toISOString()
        )
        .zadd(d.prodId, createdAt.getTime(), prodInfoId)
        .exec()
      if (!prodIds.includes(d.prodId)) {
        prodIds.push(d.prodId)
      }
    } catch (error) {
      console.log(error)
    }
  }
  try {
    await redis.sadd('productsUpdated', prodIds)
  } catch (error) {
    console.log(error)
  }
}
