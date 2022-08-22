const redis = require('redis');

class RedisClient {
  constructor() {
    this.cli = redis.createClient();
    this.cli
      .on('error', (e) => console.log('Client Error:', e));
      .on('connect', () => {
        console.log('Client Connected')
        console.log('isAlive', isAlive(this.cli));
      });
  }

  isAlive() {
    return this.cli.Connected;
  }
}

module.exports = new RedisClient();
