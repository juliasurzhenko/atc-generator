const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Реєстрація нового користувача
router.post('/register', usersController.register);

// Новий маршрут для отримання всіх користувачів
router.get('/', usersController.getAllUsers);  // GET запит для отримання всіх користувачів

// Маршрут для додавання нового користувача
router.post('/', usersController.addUser);  // POST запит для додавання користувача

// Маршрут для видалення користувача
router.delete('/:userId', usersController.deleteUser);  // DELETE запит для видалення користувача

module.exports = router;