const express = require("express");
const router = express.Router();
const programsController = require("../../controllers/programsController");

// 📌 CRUD Маршрути для програм
router.get("/", programsController.getAllPrograms); // Отримати всі програми
router.post("/", programsController.createProgram); // Створити нову програму
router.get("/:id", programsController.getProgramById); // Отримати програму за ID
router.put("/:id", programsController.updateProgram); // Оновити програму
router.delete("/:id", programsController.deleteProgram); // Видалити програму

module.exports = router;
