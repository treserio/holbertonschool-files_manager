const express = require('express');
const router = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

app
  .use(router)
  .get('/', (req, res) => {
    res.send('Express server, tied to Redis & MongoDB');
  })

  .listen(
    PORT,
    () => console.log(`Listening on port ${PORT}`),
  );
