const Day = require('../models/Day');
const Recipe = require('../models/Recipe'); // Ensure the Recipe model is imported

const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Find today's Day document
    const day = await Day.findOne({ date: { $gte: startOfDay, $lte: endOfDay } }).populate('meals');

    // Check if the Day document exists
    if (!day) {
      return res.render('dashboard', { meals: [] }); // If no document, pass an empty array
    }

    // Populate the meals with recipe details
    const meals = await Recipe.find({ _id: { $in: day.meals } });

    // Render the dashboard and pass the meals data
    res.render('dashboard', { meals });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading dashboard');
  }
};

module.exports = { getDashboard };
