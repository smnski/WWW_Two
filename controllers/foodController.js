const Food = require('../models/food');

// Fetch all foods and total calories
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
    res.render('food/index', { totalCalories, foods });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving foods');
  }
};

// Render Add Food Form
const renderAddForm = (req, res) => {
  res.render('food/add');
};

// Add Food
const addFood = async (req, res) => {
  try {
    const { name, calories } = req.body;
    const newFood = new Food({ name, calories });
    await newFood.save();
    res.redirect('/food');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding food');
  }
};

// Render Edit Food Form
const renderEditForm = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).send('Food not found');
    res.render('food/edit', { food });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving food for editing');
  }
};

// Edit Food
const editFood = async (req, res) => {
  try {
    const { name, calories } = req.body;
    await Food.findByIdAndUpdate(req.params.id, { name, calories });
    res.redirect('/food');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error editing food');
  }
};

// Delete Food
const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.redirect('/food');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting food');
  }
};

module.exports = {
  getFoods,
  renderAddForm,
  addFood,
  renderEditForm,
  editFood,
  deleteFood,
};
