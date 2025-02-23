const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const generateToken = (id) => {
  return jwt.sign({ id }, 'secret_key', { expiresIn: '24h' });
};

const login = (req, res) => {
    const { username, password } = req.body;
  
    const query = `SELECT * FROM users WHERE username = ?`;
    db.query(query, [username], (err, result) => {
      if (err || result.length === 0) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      const user = result[0];
      const isMatch = bcrypt.compareSync(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      const token = generateToken(user.id);
      res.status(200).json({ message: 'Login successful', token });
    });
};

module.exports = {
    login,
    // protectedRoute,
};
  