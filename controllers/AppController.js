const Redis = require('../utils/redis');
const Mongo = require('../utils/db');

class AppController {
  static getStatus(req, res) {
    if (Redis.isAlive() && Mongo.isAlive()) {
      return res.status(200).json({ redis: true, db: true });
    }
    return res.status(400).send('Redis and/or MongoDB not connected');
  }

  static async getStats(req, res) {
    const users = await Mongo.nbUsers();
    const files = await Mongo.nbFiles();
    return res.status(200).json({ users, files });
  }
}

module.exports = AppController;
