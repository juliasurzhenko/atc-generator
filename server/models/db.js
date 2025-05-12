const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    charset: 'utf8mb4'
});

pool.getConnection()
    .then((conn) => {
        console.log('✅ Успішне підключення до MySQL');
        conn.release();
    })
    .catch((err) => {
        console.error('❌ Помилка підключення до MySQL:', err.message);
    });

module.exports = pool;
