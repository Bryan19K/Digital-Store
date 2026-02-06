const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Routes
//app.use('/api', require('./routes/index'));
const routes = require('./routes/index');
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
//prueba de conexion
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend conectado 🚀' });
});

module.exports = app;
