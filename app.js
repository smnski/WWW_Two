// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const recipesRoutes = require('./routes/recipesRoutes');  // Add this line to import recipesRoutes

const app = express();

// MongoDB connection
mongoose
  .connect('mongodb://127.0.0.1:27017/calorieCounter', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes for recipes
app.use('/recipes', recipesRoutes);  // This makes all recipes-related routes start with "/recipes"

// 404 error handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
