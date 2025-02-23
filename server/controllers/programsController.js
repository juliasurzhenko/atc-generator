const pool = require("../models/db");

/**
 * 📌 Отримати всі програми
 */
const getAllPrograms = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, program_name, filename, uploaded_at FROM programs");
        res.json(rows);
    } catch (error) {
        console.error("❌ Помилка отримання програм:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

/**
 * 📌 Створити нову програму
 */
const createProgram = async (req, res) => {
    try {
        const { program_name } = req.body;
        const filename = req.file.originalname;
        const filedata = req.file.buffer;

        const [result] = await pool.query(
            "INSERT INTO programs (program_name, filename, filedata) VALUES (?, ?, ?)",
            [program_name, filename, filedata]
        );

        res.json({ message: "✅ Програму створено", id: result.insertId });
    } catch (error) {
        console.error("❌ Помилка створення програми:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

/**
 * 📌 Отримати програму за ID
 */
const getProgramById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT * FROM programs WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Програму не знайдено" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("❌ Помилка отримання програми:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

/**
 * 📌 Оновити програму за ID
 */
const updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const { program_name } = req.body;
        let filename = req.file ? req.file.originalname : null;
        let filedata = req.file ? req.file.buffer : null;

        const query = `
            UPDATE programs
            SET program_name = ?, 
                filename = ?, 
                filedata = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(query, [program_name, filename, filedata, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Програму не знайдено" });
        }

        res.json({ message: "✅ Програму оновлено" });
    } catch (error) {
        console.error("❌ Помилка оновлення програми:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

/**
 * 📌 Видалити програму за ID
 */
const deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM programs WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Програму не знайдено" });
        }

        res.json({ message: "✅ Програму видалено" });
    } catch (error) {
        console.error("❌ Помилка видалення програми:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};

// Експортуємо всі функції
module.exports = {
    getAllPrograms,
    createProgram,
    getProgramById,
    updateProgram,
    deleteProgram
};
