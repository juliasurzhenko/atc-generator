const express = require('express');
const cors = require('cors');
const pool = require('./models/db'); // Підключення до MySQL
const generaldataRoutes = require('./routes/generaldataRoutes'); // CRUD для generaldata
const programsRoutes = require('./routes/programsRoutes'); // CRUD для programs
// const programFilesRoutes = require('./routes/programFilesRoutes'); // CRUD для program_files
const generationRoutes = require('./routes/generationRoutes'); // Генерація сертифікатів
const cerificatesRoutes = require('./routes/certificatesRoutes'); // Getting сертифікатів by id
const usersRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 🔹 Middleware
app.use(express.json()); // Декодує JSON у запитах
app.use(express.urlencoded({ extended: true })); // Для обробки form-data
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Дозволяє передавати cookies та заголовки авторизації
    allowedHeaders: 'Content-Type,Authorization', // Дозволені заголовки
  };
  
app.use(cors(corsOptions));

// 🔹 Маршрути API
app.use('/api/generaldata', generaldataRoutes);
// app.use('/api/programs', programsRoutes);
app.use('/api/generation', generationRoutes);
app.use('/api/certificates', cerificatesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/programs", programsRoutes);

// 🔹 Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порту ${PORT}`);
});