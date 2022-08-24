const express = require('express');

const AppCon = require('../controllers/AppController');
const UserCon = require('../controllers/UsersController');
const AuthCon = require('../controllers/AuthController');

const router = express.Router();

router.get('/status', AppCon.getStatus);
router.get('/stats', AppCon.getStats);
router.post('/users', UserCon.postNew);
router.get('/connect', AuthCon.userConnect);
router.get('/disconnect', AuthCon.userDisconnect);
router.get('/users/me', UserCon.getUser);

module.exports = router;
