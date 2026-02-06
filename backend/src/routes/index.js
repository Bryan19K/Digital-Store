const express = require('express');
const router = express.Router();

// ✅ Auth funciona correctamente
router.use('/auth', require('./auth.routes'));

// 🚧 Comentamos reseñas temporalmente para que el servidor no explote
// router.use('/reviews', require('./reviews.routes')); 

// ✅ Products es lo que necesitas para tu tienda
router.use('/products', require('./products.routes')); 

module.exports = router;