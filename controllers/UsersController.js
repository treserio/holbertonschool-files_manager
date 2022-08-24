const sha1 = require('sha1');
const Mongo = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    console.log(req.body);
    const { email, password } = req.body;
    // confirm email exists & password were sent in req
    if (!email) return res.status(400).send('{"error": "Missing email"}');
    if (!password) return res.status(400).send('{"error": "Missing password"}');
    // check if the user's email exists
    console.log('wtf', await Mongo.users.findOne({ email }));
    if (await Mongo.users.findOne({ email })) return res.status(400).send('{"error": "Already exist"}');
    // create new user with sha1 hashed pw
    const newUser = await Mongo.users.insertOne({
      email,
      password: sha1(password),
    });
    console.log('new user', newUser);
    return res.status(201).json({ id: newUser.insertedId, email });
  }
}

module.exports = UsersController;
