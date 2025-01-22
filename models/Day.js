const mongoose = require('mongoose');

// Import the Recipe schema
const Recipe = require('./Recipe'); // Adjust the path if necessary
const Requirement = require('./Requirement')

const daySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true, // Ensures one entry per day
  },
  name: {
    type: String,
    trim: true,
  },
  consumedCalories: {
    type: Number,
    default: 0,
    min: 0,
  },
  consumedProtein: {
    type: Number,
    default: 0,
    min: 0,
  },
  consumedFats: {
    type: Number,
    default: 0,
    min: 0,
  },
  consumedCarbohydrates: {
    type: Number,
    default: 0,
    min: 0,
  },
  goalMet: {
    type: Boolean,
    default: false,
  },
  meals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
  ],
});

// Middleware to calculate the day of the week based on the date
daySchema.pre('save', function (next) {
  if (this.date) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.name = daysOfWeek[this.date.getDay()];
  }
  next();
});

// Pre-save middleware to calculate consumed nutrients and goalMet
daySchema.pre('save', async function (next) {
  const { meals } = this;

  let totalCalories = 0;
  let totalProtein = 0;
  let totalFats = 0;
  let totalCarbohydrates = 0;

  const populatedMeals = await mongoose.model('Recipe').find({
    _id: { $in: meals.map((meal) => meal.recipe) },
  });

  populatedMeals.forEach((recipe) => {
    totalCalories += recipe.calories;
    totalProtein += recipe.protein;
    totalFats += recipe.fats;
    totalCarbohydrates += recipe.carbohydrates;
  });

  this.consumedCalories = totalCalories;
  this.consumedProtein = totalProtein;
  this.consumedFats = totalFats;
  this.consumedCarbohydrates = totalCarbohydrates;

  const Requirement = mongoose.model('Requirement');
  const requirements = await Requirement.findOne();

  if (!requirements) {
    return next(new Error('No requirement document found! Please add requirements.'));
  }

  this.goalMet =
    this.consumedCalories >= requirements.goalCalories &&
    this.consumedProtein >= requirements.goalProtein &&
    this.consumedFats >= requirements.goalFats &&
    this.consumedCarbohydrates >= requirements.goalCarbohydrates;

  next();
});

module.exports = mongoose.models.Day || mongoose.model('Day', daySchema);