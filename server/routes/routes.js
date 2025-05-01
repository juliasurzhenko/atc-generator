const express = require('express');
const authRoutes = require('./route/authRoutes');
const generaldataRoutes = require('./route/generaldataRoutes');
const programsRoutes = require('./route/programsRoutes');
const generationRoutes = require('./route/generationRoutes');
const certificatesRoutes = require('./route/certificatesRoutes');
const usersRoutes = require('./route/usersRoutes');
const authController = require('../controllers/authController');

const router = express.Router();

// 🔓 Публічні маршрути
router.use('/auth', authRoutes);

// 🔐 Приватні маршрути — захищені middleware
router.use(authController.verifyToken);
router.use('/generaldata', generaldataRoutes);
router.use('/programs', programsRoutes);
router.use('/generation', generationRoutes);
router.use('/certificates', certificatesRoutes);
router.use('/users', usersRoutes);

module.exports = router;
