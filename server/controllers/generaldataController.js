const pool = require('../models/db');

/**
 * 📌 Отримати всі файли з `generaldata`
 */
const getAllGeneralData = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, filename_participants, uploaded_at FROM generaldata');
        res.json(rows);
    } catch (error) {
        console.error('❌ Помилка отримання файлів:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
};

/**
 * 📌 Завантажити Excel і шаблон сертифіката
 */
const uploadFiles = async (req, res) => {
    try {
        if (!req.files || !req.files['participantsFile'] || !req.files['templateFile']) {
            return res.status(400).json({ error: 'Необхідно завантажити обидва файли!' });
        }

        const participantsFile = req.files['participantsFile'][0];
        const templateFile = req.files['templateFile'][0];

        const sql = `
            INSERT INTO generaldata (filename_participants, participants_filedata, filename_template, template_filedata) 
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(sql, [
            participantsFile.originalname, participantsFile.buffer,
            templateFile.originalname, templateFile.buffer
        ]);

        res.json({ message: '✅ Файли успішно завантажені' });
    } catch (error) {
        console.error('❌ Помилка завантаження файлів:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
};

/**
 * 📌 Завантажити файл за ID
 */
const downloadFileById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM generaldata WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Файл не знайдено' });
        }

        const file = rows[0];
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename_participants}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(file.participants_filedata);
    } catch (error) {
        console.error('❌ Помилка отримання файлу:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
};

/**
 * 📌 Видалити запис за ID
 */
const deleteFileById = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM generaldata WHERE id = ?', [id]);
        res.json({ message: '✅ Запис успішно видалено' });
    } catch (error) {
        console.error('❌ Помилка видалення:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
};

// Експортуємо всі функції
module.exports = {
    getAllGeneralData,
    uploadFiles,
    downloadFileById,
    deleteFileById
};
