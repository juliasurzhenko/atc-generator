const bcrypt = require('bcryptjs');
const db = require('../models/db'); 

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
