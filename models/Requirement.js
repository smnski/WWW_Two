const mongoose = require('mongoose');

const Recipe = require('./Recipe');

const requirementSchema = new mongoose.Schema({
  goalCalories: {
    type: Number,
    required: true,
    min: 0,
  },
  goalProtein: {
    type: Number,
    required: true,
    min: 0,
  },
  goalFats: {
    type: Number,
    required: true,
    min: 0,
  },
  goalCarbohydrates: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.models.Day || mongoose.model('Requirement', requirementSchema);
