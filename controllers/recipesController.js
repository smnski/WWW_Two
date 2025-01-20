const Recipe = require('../models/Recipe');

// Get all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render('recipes', { recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recipes');
  }
};

// Add a new recipe
const addRecipe = async (req, res) => {
  try {
    const { name, calories, protein, carbohydrates, fats } = req.body;
    const newRecipe = new Recipe({
      name,
      calories,
      protein,
      carbohydrates,
      fats,
    });
    await newRecipe.save();
    res.redirect('/recipes'); // Redirect back to the recipes list
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding recipe');
  }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id; // Get the recipe ID from the URL parameter
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId); // Delete the recipe by ID

    if (deletedRecipe) {
      res.json({ message: 'Recipe deleted successfully' }); // Send a success message
    } else {
      res.status(404).json({ message: 'Recipe not found' }); // Handle case where recipe is not found
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting recipe' }); // Handle server error
  }
};

module.exports = { getRecipes, addRecipe, deleteRecipe };
