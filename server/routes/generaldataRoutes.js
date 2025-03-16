const express = require('express');
const multer = require('multer'); // Для завантаження файлів
const router = express.Router();
const generaldataController = require('../controllers/generaldataController');

// ⚡️ Налаштування `multer`
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, encoding: 'utf8' });

// 📌 CRUD Маршрути
router.get('/', generaldataController.getAllGeneralData);
router.post('/upload', upload.fields([
    { name: 'participantsFile', maxCount: 1 },
    { name: 'templateFile', maxCount: 1 }
]), generaldataController.uploadFiles);
router.get('/download/:id', generaldataController.downloadFileById);
router.delete('/:id', generaldataController.deleteFileById);

module.exports = router;
