const express = require('express');

const AppCon = require('../controllers/AppController');
const UserCon = require('../controllers/UsersController');

const router = express.Router();

router.get('/status', AppCon.getStatus);
router.get('/stats', AppCon.getStats);
router.post('/users', UserCon.postNew);

module.exports = router;
