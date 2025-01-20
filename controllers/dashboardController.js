const Goal = require('../models/Goal');

const getDashboard = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const goal = await Goal.findOne({ date: today });
    res.render('dashboard', { goal });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading dashboard');
  }
};

module.exports = { getDashboard };
