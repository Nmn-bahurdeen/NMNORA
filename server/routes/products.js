const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/products.json');

function readProducts() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

function writeProducts(products) {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2), 'utf-8');
}

// GET /api/products - return all products
router.get('/', (req, res) => {
  try {
    const products = readProducts();
    const { category, featured, bestseller, search } = req.query;

    let result = products;

    if (category) {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (featured !== undefined) {
      result = result.filter(p => p.featured === (featured === 'true'));
    }
    if (bestseller !== undefined) {
      result = result.filter(p => p.bestseller === (bestseller === 'true'));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// GET /api/products/:id - return single product
router.get('/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read product' });
  }
});

// POST /api/products - create product
router.post('/', (req, res) => {
  try {
    const products = readProducts();
    const newProduct = {
      id: `prod_${Date.now()}`,
      ...req.body,
      inStock: req.body.inStock !== undefined ? req.body.inStock : true,
      featured: req.body.featured !== undefined ? req.body.featured : false,
      bestseller: req.body.bestseller !== undefined ? req.body.bestseller : false,
      rating: req.body.rating || 0,
      reviews: req.body.reviews || 0,
      stock: req.body.stock || 0,
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - update product
router.put('/:id', (req, res) => {
  try {
    const products = readProducts();
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    products[idx] = { ...products[idx], ...req.body, id: req.params.id };
    writeProducts(products);
    res.json(products[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - delete product
router.delete('/:id', (req, res) => {
  try {
    const products = readProducts();
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    const deleted = products.splice(idx, 1)[0];
    writeProducts(products);
    res.json({ message: 'Product deleted', product: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
