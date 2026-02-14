import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import orderRoutes from './routes/orders';
import checkoutRoutes from './routes/checkout';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
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
