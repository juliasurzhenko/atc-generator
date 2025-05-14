require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: process.env.ORIGIN, //'http://localhost:5173' ,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization', 
  };
  
app.use(cors(corsOptions));

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порту ${PORT}`);
});