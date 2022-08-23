const Mongo = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    console.log(req.body);
    const { email, password } = req.body;
    // confirm email exists
    if (!email) return res.status(400).send('{"error": "Missing email"}');
    if (!password) return res.status(400).send('{"error": "Missing password"}');

    if (Mongo.users.find({name: email})) return res.status(400).send('{"error": "Already exist"}');
    return res.send("donkey dic");
  }
}

// db.users.insertOne()
module.exports = UsersController;
