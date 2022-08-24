const sha1 = require('sha1');
const Mongo = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
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
}

module.exports = UsersController;
