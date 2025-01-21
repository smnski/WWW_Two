const mongoose = require('mongoose');
const Requirement = require('../models/Requirement'); // Adjust the path to the Requirement model

// Use the same connection URI as your server
mongoose.connect('mongodb://127.0.0.1:27017/calorieCounter', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB for requirements script.');

    // Create an average requirement entry
    const averageRequirement = new Requirement({
      goalCalories: 2000,
      goalProtein: 50,
      goalFats: 70,
      goalCarbohydrates: 275,
    });

    // Save the requirement
    await averageRequirement.save();
    console.log('Average requirement saved:', averageRequirement);

    // Close the connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
