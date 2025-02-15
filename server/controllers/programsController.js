const pool = require("../models/db");

/**
 * 📌 Отримати всі файли програм
 */
const getAllPrograms = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, program_name, filename, uploaded_at FROM program_files");
        res.json(rows);
    } catch (error) {
        console.error("❌ Помилка отримання файлів програм:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

/**
 * 📌 Завантажити новий файл програми
 */
const uploadProgramFile = async (req, res) => {
    try {
        const { program_name } = req.body;
        const file = req.file;

        if (!program_name || !file) {
            return res.status(400).json({ error: "Необхідно вказати назву програми і файл" });
        }

        const [result] = await pool.query(
            "INSERT INTO program_files (program_name, filename, filedata) VALUES (?, ?, ?)",
            [program_name, file.originalname, file.buffer]
        );

        res.json({ message: "✅ Файл успішно завантажено", fileId: result.insertId });
    } catch (error) {
        console.error("❌ Помилка завантаження файлу:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

/**
 * 📌 Завантажити файл за ID
 */
const downloadProgramFileById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT filename, filedata FROM program_files WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Файл не знайдено" });
        }

        const file = rows[0];
        res.setHeader("Content-Disposition", `attachment; filename=${file.filename}`);
        res.send(file.filedata);
    } catch (error) {
        console.error("❌ Помилка завантаження файлу:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

/**
 * 📌 Видалити файл за ID
 */
const deleteProgramFileById = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM program_files WHERE id = ?", [id]);
        res.json({ message: "✅ Файл успішно видалено" });
    } catch (error) {
        console.error("❌ Помилка видалення файлу:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Експортуємо всі функції
module.exports = {
    getAllPrograms,
    uploadProgramFile,
    downloadProgramFileById,
    deleteProgramFileById
};
