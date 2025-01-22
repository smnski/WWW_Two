const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Existing route for rendering the dashboard
router.get('/', dashboardController.getDashboard);

// New route to fetch all recipes for the modal
router.get('/recipes', dashboardController.getAllRecipes);

// New route to add a recipe to the current day
router.post('/add-meal', dashboardController.addMealToToday);

router.post('/remove-meal', dashboardController.removeMealFromToday);

module.exports = router;
