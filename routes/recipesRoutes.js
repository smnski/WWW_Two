// recipesRoutes.js
const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');

// Route to get all recipes
router.get('/', recipesController.getRecipes);  // This route renders the list of recipes

// Route to display the Add Recipe form
router.get('/add', (req, res) => {
  res.render('addRecipe');  // This renders addRecipe.ejs
});

// Handle form submission to add a new recipe
router.post('/add', recipesController.addRecipe);

// Route to delete a recipe
router.delete('/delete/:id', recipesController.deleteRecipe);

// Route to edit a recipe
router.post('/edit/:id', recipesController.updateRecipe);

module.exports = router;
