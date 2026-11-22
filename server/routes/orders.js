const express = require('express');
const router = express.Router();
const { ordersDB } = require('../db/database');

function generateOrderId() {
  return 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

router.get('/', async (req, res) => {
  try {
    const orders = await ordersDB.findAsync({});
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await ordersDB.findOneAsync({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customer, items, total, deliveryFee, subtotal } = req.body;
    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer details and items are required' });
    }
    const order = {
      id: generateOrderId(),
      customer,
      items,
      subtotal: parseFloat(subtotal) || 0,
      deliveryFee: parseFloat(deliveryFee) || 0,
      total: parseFloat(total) || 0,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    await ordersDB.insertAsync(order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const numUpdated = await ordersDB.updateAsync({ id: req.params.id }, { $set: { status, updatedAt: new Date().toISOString() } }, {});
    if (numUpdated === 0) return res.status(404).json({ error: 'Order not found' });
    const updated = await ordersDB.findOneAsync({ id: req.params.id });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
