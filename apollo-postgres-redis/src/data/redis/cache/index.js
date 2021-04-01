import knex from '../../db'
import redis from '../db'

const dataXRedisToPG = async (listToXfer, between) => {
  const data = []
  let set

  try {
    for (const product of listToXfer) {
      set = await redis.zrangebyscore(product, between[0], between[1])
      for (const d of set) {
        const obj = await redis.hgetall(d)
        data.push(obj)
      }
    }
  } catch (error) {
    console.log(error)
    return false
  }

  try {
    await knex('prodInfo').insert(data)
  } catch (error) {
    console.log(error)
    return false
  }

  try {
    for (const product of listToXfer) {
      set = await redis.zrange(product, 0, -1)
      for (const d of set) {
        await redis.del(d)
      }
      await redis.del(product)
    }
  } catch (error) {
    console.log(error)
    return false
  }

  return true
}

export const transferToDB = async () => {
  let latestUpdate = Date.now()
  let lastTransfer = await redis.get('lastUpdate')
  if (!lastTransfer) {
    lastTransfer = 0
  }
  try {
    const prodList = await redis.smembers('productsUpdated')
    if (!Array.isArray(prodList) || !prodList.length) {
      console.log('No products were updated')
      return 'No products were updated'
    }
    const dataTransfer = await dataXRedisToPG(prodList, [
      lastTransfer,
      latestUpdate,
    ])
    if (!dataTransfer) {
      console.log('Error transferring data')
      return 'Error transferring data'
    }
  } catch (error) {
    console.log(error)
  }
  try {
    await redis
      .multi()
      .set('lastUpdate', latestUpdate)
      .del('productsUpdated')
      .exec()
    console.log('Products transferred successfully')
    return 'Products transferred successfully'
  } catch (error) {
    console.log(error)
  }
}
