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

const updateRecipe = async (req, res) => {
  try {
    const { name, calories, protein, carbohydrates, fats } = req.body;
    const recipeId = req.params.id;

    // Update the recipe in the database
    await Recipe.findByIdAndUpdate(recipeId, {
      name,
      calories,
      protein,
      carbohydrates,
      fats,
    });

    // Redirect back to the recipes page
    res.redirect('/recipes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating recipe');
  }
};

const filterRecipes = async (req, res) => {
  try {
    const {
      minCalories,
      maxCalories,
      minProtein,
      maxProtein,
      minCarbs,
      maxCarbs,
      minFats,
      maxFats,
    } = req.query;

    // Initialize filter object
    const filter = {};

    // Dynamically add filter criteria
    if (minCalories) filter.calories = { ...filter.calories, $gte: Number(minCalories) };
    if (maxCalories) filter.calories = { ...filter.calories, $lte: Number(maxCalories) };
    if (minProtein) filter.protein = { ...filter.protein, $gte: Number(minProtein) };
    if (maxProtein) filter.protein = { ...filter.protein, $lte: Number(maxProtein) };
    if (minCarbs) filter.carbohydrates = { ...filter.carbohydrates, $gte: Number(minCarbs) };
    if (maxCarbs) filter.carbohydrates = { ...filter.carbohydrates, $lte: Number(maxCarbs) };
    if (minFats) filter.fats = { ...filter.fats, $gte: Number(minFats) };
    if (maxFats) filter.fats = { ...filter.fats, $lte: Number(maxFats) };

    // Query the database with the constructed filter
    const filteredRecipes = await Recipe.find(filter);

    // Render the filtered recipes
    res.render('recipes', { recipes: filteredRecipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error filtering recipes');
  }
};

module.exports = { getRecipes, addRecipe, deleteRecipe, updateRecipe, filterRecipes };
