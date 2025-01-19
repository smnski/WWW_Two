const express = require('express');
const router = express.Router();
const Food = require('../models/Food'); // Model MongoDB dla potraw
const foodController = require('../controllers/foodController'); // Import kontrolera

router.get('/', foodController.getFoods); // Strona główna
router.get('/add', foodController.renderAddForm); // Formularz dodawania
router.post('/add', foodController.addFood); // Dodawanie potrawy
router.get('/edit/:id', foodController.renderEditForm); // Formularz edycji
router.post('/edit/:id', foodController.editFood); // Edycja potrawy
router.get('/delete/:id', foodController.deleteFood); // Usuwanie potrawy

// Trasa główna - wyświetlenie strony głównej z listą potraw i całkowitymi kaloriami
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find(); // Pobranie potraw z bazy danych
    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0); // Suma kalorii
    res.render('index', { totalCalories, foods }); // Renderowanie widoku index.ejs
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
});

// Trasa dodawania nowej potrawy (formularz)
router.get('/add', (req, res) => {
  res.render('add'); // Widok add.ejs z formularzem dodawania potrawy
});

// Obsługa dodawania nowej potrawy (POST)
router.post('/add', async (req, res) => {
  try {
    const { name, calories } = req.body; // Pobranie danych z formularza
    const newFood = new Food({ name, calories }); // Utworzenie nowego dokumentu
    await newFood.save(); // Zapis do bazy danych
    res.redirect('/'); // Przekierowanie na stronę główną
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd dodawania potrawy');
  }
});

// Trasa edycji potrawy (formularz edycji)
router.get('/edit/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id); // Znalezienie potrawy po ID
    if (!food) return res.status(404).send('Potrawa nie znaleziona');
    res.render('edit', { food }); // Widok edit.ejs z danymi potrawy
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera');
  }
});

// Obsługa edycji potrawy (POST)
router.post('/edit/:id', async (req, res) => {
  try {
    const { name, calories } = req.body; // Pobranie danych z formularza
    await Food.findByIdAndUpdate(req.params.id, { name, calories }); // Aktualizacja danych w bazie
    res.redirect('/'); // Przekierowanie na stronę główną
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd edytowania potrawy');
  }
});

// Trasa usuwania potrawy
router.get('/delete/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id); // Usunięcie potrawy z bazy danych
    res.redirect('/'); // Przekierowanie na stronę główną
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd usuwania potrawy');
  }
});

module.exports = router;