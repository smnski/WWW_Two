const Day = require('../models/Day');

const getDashboard = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const day = await Day.findOne({ date: today });
    res.render('dashboard', { day });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading dashboard');
  }
};

module.exports = { getDashboard };
