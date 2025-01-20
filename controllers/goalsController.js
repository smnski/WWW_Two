const Goal = require('../models/Goal');

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    res.render('goals', { goals });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading goals');
  }
};

module.exports = { getGoals };
