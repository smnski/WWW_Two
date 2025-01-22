const Day = require('../models/Day');
const Recipe = require('../models/Recipe');

const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Find today's Day document and populate meals
    const day = await Day.findOne({ date: { $gte: startOfDay, $lte: endOfDay } }).populate('meals');

    // If no Day document exists, render with an empty meal list
    if (!day) {
      return res.render('dashboard', { meals: [] });
    }

    // Render the dashboard with the populated meals
    res.render('dashboard', { meals: day.meals });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading dashboard');
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recipes.' });
  }
};

const addMealToToday = async (req, res) => {
  try {
    const { recipeId } = req.body;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }

    const today = new Date().toISOString().split('T')[0];
    let day = await Day.findOne({ date: today });

    if (!day) {
      day = new Day({ date: today, meals: [] });
    }

    // Add the recipe to today's meals
    day.meals.push(recipe._id);
    await day.save();

    // Return the full meal object (including all details) in the response
    const updatedMeal = {
      _id: recipe._id,
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      carbohydrates: recipe.carbohydrates,
      fats: recipe.fats
    };

    res.status(200).json(updatedMeal);
  } catch (error) {
    console.error('Error adding meal to today:', error);
    res.status(500).json({ error: 'Failed to add recipe.' });
  }
};


module.exports = { getDashboard, addMealToToday, getAllRecipes };
