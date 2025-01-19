const Food = require('../models/food'); // Import modelu Food

// Pobranie wszystkich potraw i całkowitych kalorii
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find(); // Pobranie wszystkich potraw
    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0); // Obliczenie sumy kalorii
    res.render('index', { totalCalories, foods }); // Render widoku index.ejs z danymi
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera przy pobieraniu potraw');
  }
};

// Formularz dodawania nowej potrawy
const renderAddForm = (req, res) => {
  res.render('add'); // Render widoku add.ejs
};

// Dodanie nowej potrawy
const addFood = async (req, res) => {
  try {
    const { name, calories } = req.body; // Pobranie danych z formularza
    const newFood = new Food({ name, calories }); // Utworzenie nowego dokumentu
    await newFood.save(); // Zapis do bazy danych
    res.redirect('/'); // Przekierowanie na stronę główną
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd podczas dodawania nowej potrawy');
  }
};

// Formularz edycji potrawy
const renderEditForm = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id); // Znalezienie potrawy po ID
    if (!food) return res.status(404).send('Potrawa nie znaleziona');
    res.render('edit', { food }); // Render widoku edit.ejs z danymi potrawy
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd serwera przy pobieraniu potrawy do edycji');
  }
};

// Edycja istniejącej potrawy
const editFood = async (req, res) => {
  try {
    const { name, calories } = req.body; // Pobranie danych z formularza
    await Food.findByIdAndUpdate(req.params.id, { name, calories }); // Aktualizacja danych w bazie
    res.redirect('/'); // Przekierowanie na stronę główną
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd podczas edycji potrawy');
  }
};

// Usuwanie potrawy
const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id); // Usunięcie potrawy z bazy
    res.redirect('/'); // Przekierowanie na stronę główną
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd podczas usuwania potrawy');
  }
};

// Eksportowanie funkcji kontrolera
module.exports = {
  getFoods,
  renderAddForm,
  addFood,
  renderEditForm,
  editFood,
  deleteFood,
};