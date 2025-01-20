const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dashboard page route
router.get('/', dashboardController.renderDashboard);

module.exports = router;
