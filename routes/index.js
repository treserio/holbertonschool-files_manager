const express = require('express');

const AppCon = require('../controllers/AppController');

const router = express.Router();

router.get('/status', AppCon.getStatus);
router.get('/stats', AppCon.getStats);

module.exports = router;
