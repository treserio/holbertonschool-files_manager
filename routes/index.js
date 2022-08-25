const express = require('express');

const AppCon = require('../controllers/AppController');
const UserCon = require('../controllers/UsersController');
const AuthCon = require('../controllers/AuthController');
const FilesCon = require('../controllers/FilesController');

const router = express.Router();

// GETS
router.get('/status', AppCon.getStatus);
router.get('/stats', AppCon.getStats);
router.get('/connect', AuthCon.userConnect);
router.get('/disconnect', AuthCon.userDisconnect);
router.get('/users/me', UserCon.getUser);
router.get('/files/:id', FilesCon.getFile);
router.get('/files', FilesCon.getFiles);

// POSTS
router.post('/users', UserCon.addUser);
router.post('/files', FilesCon.addFile);

module.exports = router;
