const express = require("express");
const multer = require("multer");
const router = express.Router();
const programFilesController = require("../controllers/programFilesController");

// ⚡️ Налаштування `multer`
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 📌 CRUD Маршрути
router.get("/", programFilesController.getAllProgramFiles);
router.post("/", upload.single("file"), programFilesController.uploadProgramFile);
router.get("/:id", programFilesController.downloadProgramFileById);
router.delete("/:id", programFilesController.deleteProgramFileById);

module.exports = router;
