const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require("../models/db");

const SECRET_KEY = process.env.SECRET_KEY;

const login = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  console.log("🔹 Отриманий запит:", req.method, req.headers['content-type']);
  console.log("📦 Дані у body:", req.body);

  const { username, password } = req.body;
  console.log("👤 Логін:", username);
  console.log("🔑 Пароль:", password);

  if (!username || !password) {
    return res.status(400).json({ message: "Логін або пароль не передані!" });
  }

  try {
    const [result] = await pool.query(`SELECT * FROM users WHERE username = ?`, [username]);

    if (result.length === 0) {
      console.warn("⚠️ Користувача не знайдено");
      return res.status(400).json({ message: 'Невірний логін або пароль' });
    }

    const user = result[0];
    console.log("👤 Користувач знайдений:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("⚠️ Невірний пароль");
      return res.status(400).json({ message: 'Невірний логін або пароль' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: '24h',
    });

    console.log("✅ Авторизація успішна, токен:", token);
    return res.status(200).json({ message: 'Авторизація успішна', token });
  } catch (err) {
    console.error("❌ Помилка сервера:", err);
    return res.status(500).json({ message: 'Помилка сервера', error: err });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ message: 'Необхідний токен' });
  }

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Токен прострочено' });
      }
      return res.status(401).json({ message: 'Недійсний токен' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { login, verifyToken };
