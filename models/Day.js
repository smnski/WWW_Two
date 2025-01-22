const mongoose = require('mongoose');
const Requirement = require('./Requirement');
const Recipe = require('./Recipe'); // If needed (some linting tools complain if unused)

/**
 * daySchema:
 * - Each Day references multiple recipes (meals).
 * - We want to sum the macros from these recipes and store them in the day document.
 */

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

// 1) Pre-save middleware to calculate day name based on date
daySchema.pre('save', function (next) {
  if (this.date) {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    this.name = daysOfWeek[this.date.getDay()];
  }
  next();
});

// 2) Pre-save middleware to calculate consumed nutrients and determine if goal is met
daySchema.pre('save', async function (next) {
  try {
    // 'this.meals' is an array of ObjectIds referencing 'Recipe'
    const { meals } = this;

    let totalCalories = 0;
    let totalProtein = 0;
    let totalFats = 0;
    let totalCarbohydrates = 0;

    // Fetch all Recipe documents whose _id is in the meals array
    const populatedMeals = await mongoose.model('Recipe').find({
      _id: { $in: meals },
    });

    // Sum the macros
    populatedMeals.forEach((recipe) => {
      totalCalories += recipe.calories;
      totalProtein += recipe.protein;
      totalFats += recipe.fats;
      totalCarbohydrates += recipe.carbohydrates;
    });

    // Assign sums to the Day fields
    this.consumedCalories = totalCalories;
    this.consumedProtein = totalProtein;
    this.consumedFats = totalFats;
    this.consumedCarbohydrates = totalCarbohydrates;

    // Check daily requirements from the single Requirement doc
    const requirements = await Requirement.findOne();
    if (!requirements) {
      // If no Requirement doc is set, let the sums stand but do not set goalMet
      this.goalMet = false;
      return next();
    }

    this.goalMet =
      this.consumedCalories >= requirements.goalCalories &&
      this.consumedProtein >= requirements.goalProtein &&
      this.consumedFats >= requirements.goalFats &&
      this.consumedCarbohydrates >= requirements.goalCarbohydrates;

    next();
  } catch (err) {
    console.error('Error in Day pre-save:', err);
    next(err);
  }
});

module.exports = mongoose.models.Day || mongoose.model('Day', daySchema);