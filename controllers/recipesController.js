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

module.exports = { getRecipes, addRecipe };
