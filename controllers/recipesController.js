const Recipe = require('../models/Recipe');

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render('recipes', { recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading recipes');
  }
};

const addRecipe = async (req, res) => {
  try {
    const { name, calories, protein, carbohydrates } = req.body;
    const newRecipe = new Recipe({ name, calories, protein, carbohydrates });
    await newRecipe.save();
    res.redirect('/recipes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding recipe');
  }
};

module.exports = { getRecipes, addRecipe };
