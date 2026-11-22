const express = require('express');
const cors = require('cors');
const { productsDB } = require('./db/database');
const seedDatabase = require('./db/seed');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Seed database on startup
seedDatabase(productsDB);

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'NMNORA API is running', version: '2.0.0', db: 'NeDB' });
});

app.get('/', (req, res) => {
  res.json({ message: 'NMNORA API is running', version: '2.0.0', db: 'NeDB' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => res.status(404).json({ error: 'API route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start listening only in standalone server mode (not serverless on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`NMNORA server running on port ${PORT}`));
}

module.exports = app;
