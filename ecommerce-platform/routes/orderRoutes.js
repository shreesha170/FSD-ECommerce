const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const router = express.Router();

// Place an order
router.post('/place', async (req, res) => {
  const { products } = req.body;
  let totalPrice = 0;

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    totalPrice += product.price * item.quantity;
    product.stock -= item.quantity;
    await product.save();
  }

  const order = new Order({ user: req.user.id, products, totalPrice });
  await order.save();
  res.status(201).json(order);
});

module.exports = router;
