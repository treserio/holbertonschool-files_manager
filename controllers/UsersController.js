const sha1 = require('sha1');
const mon = require('mongodb');
const Mongo = require('../utils/db');
const Redis = require('../utils/redis');

class UsersController {
  static async addUser(req, res) {
    // pull values from req's json data
    const { email, password } = req.body;
    // confirm email exists & password were sent in req
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });
    // check if the user's email exists
    if (await Mongo.users.findOne({ email })) return res.status(400).json({ error: 'Already exist' });
    // create new user with sha1 hashed pw
    const newUser = await Mongo.users.insertOne({
      email,
      password: sha1(password),
    });
    return res.status(201).json({ id: newUser.insertedId, email });
  }

  static async getUser(req, res) {
    // confirm the user is present
    const authToken = `auth_${req.headers['x-token']}`;
    const userId = await Redis.get(authToken);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    // grab our user and return { id, email }, convert userId to ObjectId
    const user = await Mongo.users.findOne({ _id: new mon.ObjectId(userId) });
    return res.status(200).json({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;
