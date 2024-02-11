import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Redis Clinet Class that has:
 * 1. constructor that creates a client to Redis, also handles errors
 * 2. function isAlive that returns true when the connection to Redis is a success otherwise, false
 * 3. async function get that takes a string key as argument and returns the Redis value stored for this key
 * 4. async function set that takes a string key, a value and a duration in second as arguments to store it in Redis 
 * 5. async function del that takes a string key as argument and remove the value in Redis for this key
 * Also exports an instance of RedisClient called redisClient
 * */
class RedisClient {
  constructor () {
    this.myClient = createClient();
    this.myClient.on('error', (error) => console.log(error));
  }

  isAlive () {
    return this.myClient.connected;
  }

  async get (key) {
    const getAsync = promisify(this.myClient.GET).bind(this.myClient);
    return getAsync(key);
  }

  async set (key, val, time) {
    const setAsync = promisify(this.myClient.SET).bind(this.myClient);
    return setAsync(key, val, 'EX', time);
  }

  async del (key) {
    const delAsync = promisify(this.myClient.DEL).bind(this.myClient);
    return delAsync(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
