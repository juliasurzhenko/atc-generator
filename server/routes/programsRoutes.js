const express = require("express");
const multer = require("multer");
const router = express.Router();
const programsController = require("../controllers/programsController");

// ⚡️ Налаштування `multer`
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 📌 CRUD Маршрути
router.get("/", programsController.getAllPrograms);
router.post("/", upload.single("file"), programsController.uploadProgramFile);
router.get("/:id", programsController.downloadProgramFileById);
router.delete("/:id", programsController.deleteProgramFileById);

module.exports = router;
