const mongoose = require('mongoose');

// Definicja schematu dla kolekcji 'foods'
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Pole 'name' jest wymagane
    trim: true,     // Usuwa białe znaki z początku i końca
  },
  calories: {
    type: Number,
    required: true, // Pole 'calories' jest wymagane
    min: 0,         // Kalorie nie mogą być ujemne
  },
});

// Eksport modelu opartego na schemacie
module.exports = mongoose.models.Food || mongoose.model('Food', foodSchema);
