const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

function sanitizeProductForCustomer(product) {
  if (!product) return null;
  // Never expose exact internal stock quantities to customers or guests
  const { stock, ...safeProduct } = product;
  return {
    ...safeProduct,
    inStock: stock > 0 && product.inStock !== false,
    availability: stock > 0 && product.inStock !== false ? 'In Stock' : 'Out of Stock'
  };
}

// GET /api/products - Public list of products
// Customers see "In Stock" / "Out of Stock"; Admins see exact stock
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, search, compatibility } = req.query;
    const where = {};

    if (category && category !== 'All') {
      where.category = category;
    }

    if (compatibility) {
      where.compatibility = compatibility;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    const isAdmin = req.user && req.user.role === 'ADMIN';

    if (isAdmin) {
      return res.json(products);
    }

    // Sanitize for customers and guests: strip raw stock quantities
    const sanitized = products.map(sanitizeProductForCustomer);
    res.json(sanitized);
  } catch (err) {
    console.error('[Get Products Error]:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Single product details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const isAdmin = req.user && req.user.role === 'ADMIN';
    if (isAdmin) {
      return res.json(product);
    }

    res.json(sanitizeProductForCustomer(product));
  } catch (err) {
    console.error('[Get Product Error]:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - Admin only: Add new product
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      description,
      image,
      stock,
      rating,
      reviews,
      inStock,
      featured,
      bestseller,
      compatibility,
    } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
        category: category.trim(),
        description: (description || '').trim(),
        image: image || '/products/iphone-promax.svg',
        stock: parseInt(stock) !== undefined && !isNaN(parseInt(stock)) ? parseInt(stock) : 10,
        rating: parseFloat(rating) || 4.8,
        reviews: parseInt(reviews) || 0,
        inStock: inStock !== false,
        featured: featured === true || featured === 'true',
        bestseller: bestseller === true || bestseller === 'true',
        compatibility: compatibility ? compatibility.trim() : null,
      },
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('[Create Product Error]:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Admin only: Update product
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      description,
      image,
      stock,
      rating,
      reviews,
      inStock,
      featured,
      bestseller,
      compatibility,
    } = req.body;

    const data = {};
    if (name !== undefined) data.name = name.trim();
    if (price !== undefined) data.price = parseFloat(price);
    if (originalPrice !== undefined) data.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (category !== undefined) data.category = category.trim();
    if (description !== undefined) data.description = description.trim();
    if (image !== undefined) data.image = image;
    if (stock !== undefined) data.stock = parseInt(stock);
    if (rating !== undefined) data.rating = parseFloat(rating);
    if (reviews !== undefined) data.reviews = parseInt(reviews);
    if (inStock !== undefined) data.inStock = inStock === true || inStock === 'true';
    if (featured !== undefined) data.featured = featured === true || featured === 'true';
    if (bestseller !== undefined) data.bestseller = bestseller === true || bestseller === 'true';
    if (compatibility !== undefined) data.compatibility = compatibility ? compatibility.trim() : null;

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data,
    });

    res.json(updated);
  } catch (err) {
    console.error('[Update Product Error]:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Admin only: Delete product
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (err) {
    console.error('[Delete Product Error]:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
