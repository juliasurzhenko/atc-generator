const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');  // Підключення до бази даних

// Створення JWT токену
const generateToken = (id) => {
  return jwt.sign({ id }, 'secret_key', { expiresIn: '24h' });
};

// Реєстрація нового користувача
const register = (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
  db.query(query, [username, hashedPassword, email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error registering user' });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
};

// Логін користувача
// const login = (req, res) => {
//   const { username, password } = req.body;

//   const query = `SELECT * FROM users WHERE username = ?`;
//   db.query(query, [username], (err, result) => {
//     if (err || result.length === 0) {
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }

//     const user = result[0];
//     const isMatch = bcrypt.compareSync(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }

//     const token = generateToken(user.id);
//     res.status(200).json({ message: 'Login successful', token });
//   });
// };

// // Захищений маршрут для перевірки токену
// const protectedRoute = (req, res) => {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(401).json({ message: 'Token is required' });
//   }

//   jwt.verify(token, 'secret_key', (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Invalid or expired token' });
//     }

//     res.status(200).json({ message: 'Access granted', userId: decoded.id });
//   });
// };

const getAllUsers = async (req, res) => {
  try {
    // Використовуємо проміс для виконання запиту
    const [rows] = await db.query('SELECT id, username, email FROM users');
    res.status(200).json(rows);  // Відправка результату
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

const addUser = (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(query, [username, hashedPassword, email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding user' });
    }
    res.status(200).json({ message: 'User added successfully' });
  });
};

// Видалення користувача
const deleteUser = (req, res) => {
  const { userId } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting user' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
};
module.exports = {
  register,
  // login,
  // protectedRoute,
  getAllUsers,
  addUser,  // Додаємо нову функцію до експорту
  deleteUser,
};
