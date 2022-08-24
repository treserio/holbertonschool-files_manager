const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const Mongo = require('../utils/db');
const Redis = require('../utils/redis');

class AuthController {
  static async userConnect(req, res) {
    // get the user info in base64
    const authHeader = req.headers.authorization.split(' ')[1];
    // swap to ascii string
    const auth = Buffer.from(authHeader, 'base64').toString();
    // pull the email and the password out of the string
    const [email, pass] = auth.split(':');
    // check authorization of user to continue
    const user = await Mongo.users.findOne({
      email,
      password: pass ? sha1(pass) : null,
    });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // create uuid v4 string to use as auth token, and store in redis for 24hrs
    const token = uuidv4();
    await Redis.set(`auth_${token}`, user._id.toString(), 86400);
    return res.status(200).json({ token });
  }

  static async userDisconnect(req, res) {
    // confirm the user is present
    const authToken = `auth_${req.headers['x-token']}`;
    if (!await Redis.get(authToken)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // remove the user's authorization token from redis
    Redis.del(authToken);
    return res.status(204).send();
  }
}

module.exports = AuthController;
