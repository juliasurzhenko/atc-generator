const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Логін користувача
router.post('/login', authController.login);

// Захищений маршрут
// router.get('/protected', usersController.protectedRoute);

module.exports = router;