const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.getDashboard);

router.get('/recipes', dashboardController.getAllRecipes);

router.post('/add-meal', dashboardController.addMealToToday);

router.post('/remove-meal', dashboardController.removeMealFromToday);

module.exports = router;