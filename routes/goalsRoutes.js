const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goalsController');

// Goals and progress page route
router.get('/', goalsController.renderGoals);

module.exports = router;
