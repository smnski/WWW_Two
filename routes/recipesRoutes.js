const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');

router.get('/', recipesController.getRecipes); 

// Route to display the Add Recipe form
router.get('/add', (req, res) => {
  res.render('addRecipe');
});

// Handle form submission to add a new recipe
router.post('/add', recipesController.addRecipe);

// Route to delete a recipe
router.delete('/delete/:id', recipesController.deleteRecipe);

// Route to edit a recipe
router.post('/edit/:id', recipesController.updateRecipe);

// Filter recipes
router.get('/filter', recipesController.filterRecipes);

module.exports = router;
