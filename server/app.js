const express = require('express');
const cors = require('cors');
const pool = require('./models/db'); // Підключення до MySQL
const generaldataRoutes = require('./routes/generaldataRoutes'); // CRUD для generaldata
// const programsRoutes = require('./routes/programsRoutes'); // CRUD для programs
const programFilesRoutes = require('./routes/programFilesRoutes'); // CRUD для program_files
// const certificatesRoutes = require('./routes/certificatesRoutes'); // Генерація сертифікатів
const usersRoutes = require('./routes/usersRoutes');

const app = express();

// 🔹 Middleware
app.use(express.json()); // Декодує JSON у запитах
app.use(express.urlencoded({ extended: true })); // Для обробки form-data
app.use(cors()); // Дозволяє CORS

// 🔹 Маршрути API
app.use('/api/generaldata', generaldataRoutes);
// app.use('/api/programs', programsRoutes);
app.use('/api/program-files', programFilesRoutes);
// app.use('/api/certificates', certificatesRoutes);
app.use('/api/users', usersRoutes);

// 🔹 Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порту ${PORT}`);
});

//--------
// const mysql = require('mysql2/promise');
// const xlsx = require('xlsx');
// const fs = require('fs');
// const path = require('path');
// const mammoth = require('mammoth');
// const { Document, Packer, Paragraph, TextRun } = require('docx');
// const express = require('express');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// app.use(cors());

// // MySQL connection setup
// const dbConfig = {
//     host: '127.0.0.1',
//     port: 3306,
//     user: 'root', // Замініть на свій логін
//     password: 'qwerty123',
//     database: 'generator'
// };

// async function testDatabaseConnection() {
//     try {
//         const connection = await mysql.createConnection(dbConfig);
//         console.log("✅ Успішне підключення до бази даних!");
//         await connection.end();
//     } catch (error) {
//         console.error("❌ Помилка підключення до бази даних:", error.message);
//     }
// }

// testDatabaseConnection();

// app.get('/download/:id', async (req, res) => {
//     try {
//         const fileId = req.params.id;

//         // Підключаємося до бази
//         const connection = await mysql.createConnection(dbConfig);
//         const [rows] = await connection.execute(
//             "SELECT filename, filedata FROM uploads WHERE id = ?", 
//             [fileId]
//         );
//         await connection.end();

//         if (rows.length === 0) {
//             return res.status(404).json({ message: "Файл не знайдено" });
//         }

//         const file = rows[0];

//         // Встановлюємо заголовки для скачування
//         res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
//         res.setHeader('Content-Type', 'application/octet-stream');

//         // Відправляємо файл як відповідь
//         res.send(file.filedata);

//     } catch (error) {
//         res.status(500).json({ message: "Помилка завантаження файлу", error: error.message });
//     }
// });

// app.listen(port, () => {
//     console.log(`🚀 Сервер працює на http://localhost:${port}`);
// });
//--------------
//---------працює:
// async function uploadLocalFile(filePath) {
//     try {
//         // Читаємо файл у буфер
//         const fileBuffer = fs.readFileSync(filePath);
//         const filename = filePath.split('/').pop(); // Отримуємо назву файлу

//         // Підключаємося до MySQL
//         const connection = await mysql.createConnection(dbConfig);
//         const sql = "INSERT INTO uploads (filename, filedata) VALUES (?, ?)";
//         await connection.execute(sql, [filename, fileBuffer]);
//         await connection.end();

//         console.log(`✅ Файл ${filename} успішно завантажено в базу!`);
//     } catch (error) {
//         console.error("❌ Помилка завантаження файлу в базу:", error.message);
//     }
// }

// // Виклик функції для завантаження `listeners.xlsx`
// uploadLocalFile('./listeners.xlsx');

//--------------------
// app.post('/upload', upload.single('file'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "Файл не надіслано" });
//         }

//         // Читаємо файл у буфер
//         const fileBuffer = fs.readFileSync(req.file.path);
//         const filename = req.file.originalname;

//         // Підключаємося до MySQL
//         const connection = await mysql.createConnection(dbConfig);
//         const sql = "INSERT INTO uploads (filename, filedata) VALUES (?, ?)";
//         await connection.execute(sql, [filename, fileBuffer]);
//         await connection.end();

//         // Видаляємо тимчасовий файл
//         fs.unlinkSync(req.file.path);

//         res.json({ message: "Файл успішно завантажено у базу", filename });

//     } catch (error) {
//         res.status(500).json({ message: "Помилка завантаження файлу", error: error.message });
//     }
// });

// Запуск сервера
// app.listen(port, () => {
//     console.log(`🚀 Сервер працює на http://localhost:${port}`);
// });
