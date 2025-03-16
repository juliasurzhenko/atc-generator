const pool = require('../models/db');

/**
 * 📌 Отримати всі файли з `generaldata`
 */
const getAllGeneralData = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, participants_filename, template_filename, uploaded_at FROM generaldata');
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

        console.log("📂 Отримано файли:", participantsFile.originalname, templateFile.originalname);

        const sql = `
            INSERT INTO generaldata (participants_filename, participants_filedata, template_filename, template_filedata) 
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(sql, [
            participantsFile.originalname, Buffer.from(participantsFile.buffer),
            templateFile.originalname, Buffer.from(templateFile.buffer)
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
        const { type } = req.query; // отримуємо тип файлу ('participants' або 'template')

        const [rows] = await pool.query('SELECT * FROM generaldata WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Файл не знайдено' });
        }

        const file = rows[0];

        let filename, filedata;
        if (type === 'participants') {
            filename = file.participants_filename;
            filedata = file.participants_filedata;
        } else if (type === 'template') {
            filename = file.template_filename;
            filedata = file.template_filedata;
        } else {
            return res.status(400).json({ error: 'Некоректний тип файлу' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(filedata);
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
