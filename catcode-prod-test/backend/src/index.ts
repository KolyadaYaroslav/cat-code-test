import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/database';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
const start = async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API docs:`);
      console.log(`  - GET  /api/health`);
      console.log(`  - POST /api/auth/register`);
      console.log(`  - POST /api/auth/login`);
      console.log(`  - GET  /api/auth/me`);
      console.log(`  - GET  /api/products`);
      console.log(`  - GET  /api/products/:id`);
      console.log(`  - GET  /api/products/categories/list`);
      console.log(`  - GET  /api/products/search/query?q=<query>`);
      console.log(`  - POST /api/orders`);
      console.log(`  - GET  /api/orders`);
      console.log(`  - GET  /api/orders/:id`);
      console.log(`  - PATCH /api/orders/:id/status`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
