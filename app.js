const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const dashboardRoutes = require('./routes/dashboardRoutes');
const recipesRoutes = require('./routes/recipesRoutes');
const goalsRoutes = require('./routes/goalsRoutes');

const app = express();

// Database connection
mongoose
  .connect('mongodb://127.0.0.1:27017/nutritionTracker', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', dashboardRoutes);
app.use('/recipes', recipesRoutes);
app.use('/goals', goalsRoutes);

// 404 Error handling
app.use((req, res) => res.status(404).send('Page not found'));

// Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
