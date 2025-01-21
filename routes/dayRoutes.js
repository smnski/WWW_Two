const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');

router.get('/', dayController.getDayGoals);

module.exports = router;
