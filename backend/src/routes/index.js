const express = require('express');
const router = express.Router();

// Definimos la ruta que el frontend está buscando
router.get('/products', (req, res) => {
  // En lugar de buscar en la DB, enviamos este array fijo
  const mockProducts = [
    {
      _id: '1',
      name: 'iPhone 15 Pro',
      price: 999,
      image: 'https://via.placeholder.com/200',
      description: 'El último grito de Apple'
    },
    {
      _id: '2',
      name: 'Samsung S24 Ultra',
      price: 1199,
      image: 'https://via.placeholder.com/200',
      description: 'Poder puro de Android'
    }
  ];

  res.json(mockProducts); // Enviamos los productos
});

module.exports = router;