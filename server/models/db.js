const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'qwerty123',
    database: 'generator',
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0,
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
