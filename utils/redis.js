import { promisify } from 'util';
import { createClient } from 'redis';

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
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  isAlive() {
    return this.isClientConnected;
  }

  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
