const { MongoClient } = require('mongodb');

class DBClient {
  constructor(
    host = process.env.DB_HOST || 'localhost',
    port = process.env.DB_PORT || 27017,
    database = process.env.DB_DATABASE || 'files_manager',
  ) {
    this.isAlive = function isAlive() { return false; };
    // console.log('db constructor\n');
    MongoClient.connect(
      `mongodb://${host}:${port}/${database}`,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) {
          client.close();
          return console.log(err);
        }
        this.isAlive = function isAlive() { return true; };
        // console.log(client);
        this.users = client.db(database).collection('users');
        this.files = client.db(database).collection('files');
        return console.log('mongoDb connected');
      },
    );
  }

  async nbUsers() {
    return this.users.countDocuments({});
  }

  async nbFiles() {
    return this.files.countDocuments({});
  }
}

module.exports = new DBClient();
