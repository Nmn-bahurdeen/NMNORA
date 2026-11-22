const express = require('express');
const cors = require('cors');
require('dotenv').config();

const seedDatabase = require('./db/seed');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Seed database on startup
seedDatabase().catch((err) => {
  console.error('[Startup Seed Error]:', err);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api', (req, res) => {
  res.json({
    message: 'NMNORA Apple Store & Accessories API',
    version: '3.0.0',
    db: 'Prisma SQLite/MySQL',
    status: 'online',
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'NMNORA Apple Store & Accessories API',
    version: '3.0.0',
    db: 'Prisma SQLite/MySQL',
    status: 'online',
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => res.status(404).json({ error: 'API route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[NMNORA] Server running on http://localhost:${PORT}`);
});

module.exports = app;
