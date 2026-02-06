const express = require('express');
const router = express.Router();

// ⚠️ Esto luego lo conectas a Mongo, por ahora probamos
router.get('/', async (req, res) => {
  res.json([
    {
      _id: '1',
      name: { es: 'Producto de prueba', en: 'Test product' },
      description: { es: 'Descripción de prueba', en: 'Test description' },
      price: 25,
      images: ['https://via.placeholder.com/300'],
      category: 'test'
    }
  ]);
});

module.exports = router;
