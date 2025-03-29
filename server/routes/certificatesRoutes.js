const express = require("express");
const {getCertificatesByGeneralDataId} = require("../controllers/certificatesController");

const router = express.Router();

router.get("/generaldata/:id", getCertificatesByGeneralDataId); // ✅ Додаємо новий маршрут

module.exports = router;
