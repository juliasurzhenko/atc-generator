const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

// Middleware для встановлення CORS-заголовків
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
  
  // Обробка preflight-запитів
router.options('*', (req, res) => {
    res.sendStatus(200);
});
  
// 🔹 Логін
router.post('/login', authController.login);

// 🔹 Захищений маршрут (перевіряє токен)
router.get('/protected', authController.verifyToken, (req, res) => {
    res.json({ message: 'Доступ дозволено', user: req.user });
});


module.exports = router;
