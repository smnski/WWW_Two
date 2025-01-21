const Day = require('../models/Day');

const getDayGoals = async (req, res) => {
  try {
    const goals = await Day.find();
    res.render('goals', { goals });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading goals');
  }
};

module.exports = { getDayGoals };
