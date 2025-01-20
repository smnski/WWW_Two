const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dashboardRoutes = require('./routes/dashboardRoutes');
const foodRoutes = require('./routes/foodRoutes');
const recipesRoutes = require('./routes/recipesRoutes');

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/calorieCounter', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', dashboardRoutes);
app.use('/food', foodRoutes);
app.use('/recipes', recipesRoutes);

app.use((req, res) => {
  res.status(404).send('Page not found');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
