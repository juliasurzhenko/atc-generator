const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Логін користувача
router.post('/login', usersController.login);

module.exports = router;