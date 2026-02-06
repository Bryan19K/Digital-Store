// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Buscar token en el header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Acceso denegado, token faltante' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded; // agregamos la info del usuario al request
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware;
