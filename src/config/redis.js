import Redis from 'ioredis';


const redis = new Redis();
const setRedisKey = async (key, value) => {
  await redis.set(key, value);
}

const setTimeBasedKey = async(key, value, timeToLive) =>{
  await redis.set(key, value, {
    EX: timeToLive
  })
}

const getRedisKey = async(key) => {
  const redisValue = await redis.get(key);
  return redisValue;
}

const removeRedisKey = async(key) =>{
  await redis.del(key);
}

module.exports = {
  setRedisKey, 
  getRedisKey, 
  removeRedisKey, 
  setTimeBasedKey
}
