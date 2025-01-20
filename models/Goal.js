const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  goalCalories: {
    type: Number,
    required: true,
    min: 0,
  },
  consumedCalories: {
    type: Number,
    default: 0, // Default to zero if no data has been entered yet
    min: 0,
  },
  goalProtein: {
    type: Number,
    required: true,
    min: 0,
  },
  consumedProtein: {
    type: Number,
    default: 0,
    min: 0,
  },
  goalFats: {
    type: Number,
    required: true,
    min: 0,
  },
  consumedFats: {
    type: Number,
    default: 0,
    min: 0,
  },
  goalCarbohydrates: {
    type: Number,
    required: true,
    min: 0,
  },
  consumedCarbohydrates: {
    type: Number,
    default: 0,
    min: 0,
  },
  goalMet: {
    type: Boolean,
    default: false, // Automatically updated based on goals and consumption
  },
});

// Pre-save middleware to calculate if the goal is met
daySchema.pre('save', function (next) {
  const { goalCalories, consumedCalories, goalProtein, consumedProtein, goalFats, consumedFats, goalCarbohydrates, consumedCarbohydrates } = this;

  this.goalMet =
    consumedCalories >= goalCalories &&
    consumedProtein >= goalProtein &&
    consumedFats >= goalFats &&
    consumedCarbohydrates >= goalCarbohydrates;

  next();
});

module.exports = mongoose.models.Day || mongoose.model('Day', daySchema);