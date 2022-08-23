const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.cli = redis.createClient();
    this.cli
      .on('error', (e) => console.log('Client Error:', e))
      .on('connect', () => console.log('redis-connected'));
    this.g = null;
  }

  isAlive() {
    return this.cli.connected;
  }

  async get(key) {
    return promisify(this.cli.get).bind(this.cli)(key);
  }

  async set(key, value, duration) {
    this.cli.set(key, value, 'EX', duration);
    return value;
  }

  async del(key) {
    this.cli.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
