const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');
const { requireAdmin } = require('../middleware/auth');

// All routes in this router require verified ADMIN role
router.use(requireAdmin);

// GET /api/admin/stats - Comprehensive business analytics
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { status: 'Pending' } });
    const deliveredOrders = await prisma.order.count({ where: { status: 'Delivered' } });
    const processingOrders = await prisma.order.count({ where: { status: 'Processing' } });
    const shippedOrders = await prisma.order.count({ where: { status: 'Shipped' } });

    const totalProducts = await prisma.product.count();
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

    // Aggregate revenue (excluding cancelled orders)
    const validOrders = await prisma.order.findMany({
      where: { status: { not: 'Cancelled' } },
      select: { total: true }
    });
    const totalRevenue = validOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Low stock items (stock < 10)
    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lt: 10 } },
      select: { id: true, name: true, stock: true, category: true, price: true }
    });

    res.json({
      totalRevenue,
      totalSales: totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
    });
  } catch (error) {
    console.error('[Admin Stats Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve admin business analytics' });
  }
});

// GET /api/admin/orders - All customer orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });
    res.json(orders);
  } catch (error) {
    console.error('[Admin Orders Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// PATCH /api/admin/orders/:id/status - Update order delivery status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: true }
    });
    res.json(updated);
  } catch (error) {
    console.error('[Admin Update Order Error]:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// GET /api/admin/customers - List all registered customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        pincode: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    console.error('[Admin Customers Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve customers' });
  }
});

// GET /api/admin/inventory - Full inventory with exact stock
router.get('/inventory', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(products);
  } catch (error) {
    console.error('[Admin Inventory Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve inventory' });
  }
});

module.exports = router;
