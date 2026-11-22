const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');
const { authenticateToken, requireAuth, requireAdmin } = require('../middleware/auth');

function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${randomStr}`;
}

// POST /api/orders - Place a new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { customer, items, total, deliveryFee, subtotal } = req.body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Customer details and items are required' });
    }

    const { name, email, phone, address, city, pincode } = customer;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ error: 'Name, email, phone, and address are required' });
    }

    const orderNumber = generateOrderNumber();
    const orderUserId = req.user ? req.user.id : null;

    // Create order with order items in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: orderUserId,
          customerName: name.trim(),
          customerEmail: email.trim().toLowerCase(),
          customerPhone: phone.trim(),
          shippingAddress: address.trim(),
          city: (city || 'Chennai').trim(),
          pincode: (pincode || '600048').trim(),
          subtotal: parseFloat(subtotal) || 0,
          deliveryFee: parseFloat(deliveryFee) || 0,
          total: parseFloat(total) || 0,
          status: 'Pending',
          items: {
            create: items.map((item) => ({
              productId: item.productId || item.id || null,
              productName: item.name || item.productName || 'Product',
              price: parseFloat(item.price) || 0,
              quantity: parseInt(item.quantity) || 1,
              image: item.image || null,
              category: item.category || null,
            })),
          },
        },
        include: { items: true },
      });

      // Update / decrement stock for products where productId is provided
      for (const item of items) {
        const prodId = item.productId || item.id;
        if (prodId) {
          const prod = await tx.product.findUnique({ where: { id: prodId } });
          if (prod) {
            const newStock = Math.max(0, prod.stock - (parseInt(item.quantity) || 1));
            await tx.product.update({
              where: { id: prodId },
              data: {
                stock: newStock,
                inStock: newStock > 0,
              },
            });
          }
        }
      }

      return order;
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('[Create Order Error]:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET /api/orders/my-orders - Authenticated customer's personal order history
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: req.user.id },
          { customerEmail: req.user.email.toLowerCase() },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    res.json(orders);
  } catch (err) {
    console.error('[My Orders Error]:', err);
    res.status(500).json({ error: 'Failed to fetch personal orders' });
  }
});

// GET /api/orders - Admin only: List all customer orders
router.get('/', requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    res.json(orders);
  } catch (err) {
    console.error('[All Orders Error]:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - View order by ID (customer can only view own; admin can view any)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization: Must be order owner OR admin
    const isOwner = req.user && (order.userId === req.user.id || order.customerEmail.toLowerCase() === req.user.email.toLowerCase());
    const isAdmin = req.user && req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Access denied. You do not have permission to view this order.' });
    }

    res.json(order);
  } catch (err) {
    console.error('[Get Order Error]:', err);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

module.exports = router;
