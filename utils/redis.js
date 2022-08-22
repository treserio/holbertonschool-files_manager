const redis = require('redis');

class RedisClient {
  constructor() {
    this.cli = redis.createClient();
    this.cli
      .on('error', (e) => console.log('Client Error:', e))
      .on('connect', () => console.log('redis-connected'));
    this.g = NaN;
  }

  isAlive() {
    return this.cli.connected;
  }

  get(key) {
    this.cli.get(key, (err, data) => this.g = data);
    return this.g;
  }

  set(key, value, duration) {
    this.cli.set(key, value, 'EX', duration)
    return value;
  }

  del(key) {
    this.cli.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
