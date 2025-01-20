const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');

// Recipes page route
router.get('/', recipesController.renderRecipes);

module.exports = router;
