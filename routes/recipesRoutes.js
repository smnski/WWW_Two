const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');

router.get('/', recipesController.getRecipes);
router.post('/add', recipesController.addRecipe);

module.exports = router;
