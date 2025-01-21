const mongoose = require('mongoose');

// Import the Recipe schema
const Recipe = require('./Recipe'); // Adjust the path if necessary

const daySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  consumedCalories: {
    type: Number,
    default: 0, // Automatically calculated
    min: 0,
  },
  consumedProtein: {
    type: Number,
    default: 0, // Automatically calculated
    min: 0,
  },
  consumedFats: {
    type: Number,
    default: 0, // Automatically calculated
    min: 0,
  },
  consumedCarbohydrates: {
    type: Number,
    default: 0, // Automatically calculated
    min: 0,
  },
  goalMet: {
    type: Boolean,
    default: false, // Automatically updated based on goals and consumption
  },
  meals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
  ],
});

// Pre-save middleware to calculate consumed nutrients and goalMet
daySchema.pre('save', async function (next) {
  const { meals } = this;

  // Initialize totals
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFats = 0;
  let totalCarbohydrates = 0;

  // Populate recipes and calculate totals
  const populatedMeals = await mongoose.model('Recipe').find({
    _id: { $in: meals.map((meal) => meal.recipe) },
  });

  populatedMeals.forEach((recipe) => {
    totalCalories += recipe.calories;
    totalProtein += recipe.protein;
    totalFats += recipe.fats;
    totalCarbohydrates += recipe.carbohydrates;
  });

  // Update consumed values
  this.consumedCalories = totalCalories;
  this.consumedProtein = totalProtein;
  this.consumedFats = totalFats;
  this.consumedCarbohydrates = totalCarbohydrates;

  // Fetch the requirement document (assuming there's only one document for now)
  const Requirement = mongoose.model('Requirement'); // Import the Requirement model
  const requirements = await Requirement.findOne();

  if (!requirements) {
    return next(new Error('No requirement document found! Please add requirements.'));
  }

  // Determine if goals are met
  this.goalMet =
    this.consumedCalories >= requirements.goalCalories &&
    this.consumedProtein >= requirements.goalProtein &&
    this.consumedFats >= requirements.goalFats &&
    this.consumedCarbohydrates >= requirements.goalCarbohydrates;

  next();
});

module.exports = mongoose.models.Day || mongoose.model('Day', daySchema);
