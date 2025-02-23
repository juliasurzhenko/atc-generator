const express = require("express");
const multer = require("multer");
const router = express.Router();
const programsController = require("../controllers/programsController");

// ⚡️ Налаштування `multer` для завантаження файлів
const storage = multer.memoryStorage(); // Файли зберігаються в пам'яті
const upload = multer({ storage: storage });

// 📌 CRUD Маршрути для програм
router.get("/", programsController.getAllPrograms); // Отримати всі програми
router.post("/", upload.single("file"), programsController.createProgram); // Створити нову програму
router.get("/:id", programsController.getProgramById); // Отримати програму за ID
router.put("/:id", upload.single("file"), programsController.updateProgram); // Оновити програму
router.delete("/:id", programsController.deleteProgram); // Видалити програму

module.exports = router;
