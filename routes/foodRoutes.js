const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// Food routes
router.get('/', foodController.getFoods); // List all foods
router.get('/add', foodController.renderAddForm); // Show add food form
router.post('/add', foodController.addFood); // Add a new food
router.get('/edit/:id', foodController.renderEditForm); // Show edit form
router.post('/edit/:id', foodController.editFood); // Edit food
router.get('/delete/:id', foodController.deleteFood); // Delete food

module.exports = router;
