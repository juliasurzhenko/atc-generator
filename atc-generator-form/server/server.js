const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Підключення до MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',  
  user: "root",
  password: "qwerty123", // Замінити на пароль MySQL
  database: "generator", // Назва бази даних
});

// Перевірка підключення
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Endpoint для отримання питаньt
app.get("/questions", (req, res) => {
  const query = "SELECT * FROM questions";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch questions" });
    } else {
      const formattedResults = results.map((q) => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : null,
      }));
      res.json(formattedResults);
    }
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
