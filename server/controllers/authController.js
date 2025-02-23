const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const login = (req, res) => {
  console.log(`1-->${req}`);

  const { username, password } = req.body;
  console.log(`2-->${username} ${password}`);

};

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

module.exports = {
    login,
    // protectedRoute,
};
  