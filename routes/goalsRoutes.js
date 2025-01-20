const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goalsController');

router.get('/', goalsController.getGoals);

module.exports = router;
