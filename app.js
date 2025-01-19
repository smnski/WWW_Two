const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const foodRoutes = require('./routes/foodRoutes');

const app = express();

// Konfiguracja połączenia z MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/calorieCounter', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Połączono z bazą danych MongoDB'))
  .catch((err) => console.error('Błąd połączenia z MongoDB:', err));

// Middleware - Obsługa przesyłanych danych z formularzy
app.use(bodyParser.urlencoded({ extended: true }));

// Ustawienie EJS jako silnika widoków
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Obsługa plików statycznych (CSS, JS, obrazy)
app.use(express.static(path.join(__dirname, 'public')));

// Użycie tras zdefiniowanych w `foodRoutes.js`
app.use('/', foodRoutes);

// Obsługa błędu 404 - strona nie znaleziona
app.use((req, res) => {
  res.status(404).send('Strona nie znaleziona');
});

// Uruchomienie serwera na porcie 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});