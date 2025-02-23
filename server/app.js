const express = require('express');
const cors = require('cors');
const pool = require('./models/db'); // Підключення до MySQL
const generaldataRoutes = require('./routes/generaldataRoutes'); // CRUD для generaldata
const programsRoutes = require('./routes/programsRoutes'); // CRUD для programs
// const programFilesRoutes = require('./routes/programFilesRoutes'); // CRUD для program_files
// const certificatesRoutes = require('./routes/certificatesRoutes'); // Генерація сертифікатів
const usersRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 🔹 Middleware
app.use(express.json()); // Декодує JSON у запитах
app.use(express.urlencoded({ extended: true })); // Для обробки form-data
app.use(cors()); // Дозволяє CORS

// 🔹 Маршрути API
app.use('/api/generaldata', generaldataRoutes);
// app.use('/api/programs', programsRoutes);
// app.use('/api/certificates', certificatesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api', authRoutes);
app.use("/api/programs", programsRoutes);

// 🔹 Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порту ${PORT}`);
});