import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import orderRoutes from './routes/orders';
import checkoutRoutes from './routes/checkout';
import settingsRoutes from './routes/settings';

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar carpeta de subidas (Ruta absoluta segura)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Carpeta uploads creada en:', uploadsDir);
}

// Middleware Globales
// CORS Configuration for Production
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests from CLIENT_URL (Vercel frontend)
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173', // Local development
      'http://localhost:3000'
    ].filter(Boolean) as string[]; // Remove undefined values

    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Exponer Carpeta uploads como Estática
app.use('/uploads', express.static(uploadsDir));
app.use(express.static('public'));

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      language?: string;
      user?: any;
    }
  }
}

// Language Middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const lang = req.headers['accept-language'] || 'es';
  req.language = lang.startsWith('en') ? 'en' : 'es';
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/settings', settingsRoutes);

console.log('Attempting to connect to MongoDB Atlas...');
console.log('URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');

// Database Connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('Check if your IP is whitelisted in MongoDB Atlas or if the credentials are correct.');
    // Start server anyway so we don't get "Refused" but maybe 500s, to prove it's running
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without DB)`);
    });
  });

