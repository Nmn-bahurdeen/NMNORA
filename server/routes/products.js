const express = require('express');
const router = express.Router();
const { productsDB } = require('../db/database');

function generateId() {
  return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await productsDB.findAsync({});
    products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await productsDB.findOneAsync({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const { name, price, originalPrice, category, description, image, stock, rating, reviews, inStock, featured, bestseller } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price and category are required' });
    }
    const product = {
      id: generateId(),
      name: name.trim(),
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice) || parseFloat(price),
      category: category.trim(),
      description: (description || '').trim(),
      image: image || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&h=500&fit=crop',
      rating: parseFloat(rating) || 4.0,
      reviews: parseInt(reviews) || 0,
      inStock: inStock !== false,
      featured: featured === true || featured === 'true',
      bestseller: bestseller === true || bestseller === 'true',
      stock: parseInt(stock) || 10,
      createdAt: new Date().toISOString(),
    };
    await productsDB.insertAsync(product);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    const numUpdated = await productsDB.updateAsync({ id: req.params.id }, { $set: updateData }, {});
    if (numUpdated === 0) return res.status(404).json({ error: 'Product not found' });
    const updated = await productsDB.findOneAsync({ id: req.params.id });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const numRemoved = await productsDB.removeAsync({ id: req.params.id }, {});
    if (numRemoved === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
