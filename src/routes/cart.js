const express = require('express');
const router = express.Router();
const products = require('../data/products');

function recalcCart(cart) {
  cart.totalQty = Object.values(cart.items).reduce((sum, item) => sum + item.qty, 0);
  cart.totalPrice = Object.values(cart.items).reduce((sum, item) => sum + item.qty * item.price, 0);
}

router.get('/', (req, res) => {
  const cart = req.session.cart || { items: {}, totalQty: 0, totalPrice: 0 };
  res.render('cart', { title: 'Your Cart', cart });
});

router.post('/add', (req, res) => {
  const { id, qty } = req.body;
  const product = products.find((p) => p.id === id);
  const quantity = Math.max(1, parseInt(qty || '1', 10));
  if (!product) {
    return res.status(400).send('Invalid product');
  }
  if (!req.session.cart) {
    req.session.cart = { items: {}, totalQty: 0, totalPrice: 0 };
  }
  const existing = req.session.cart.items[id] || { id: product.id, name: product.name, price: product.price, image: product.image, qty: 0 };
  existing.qty += quantity;
  req.session.cart.items[id] = existing;
  recalcCart(req.session.cart);
  res.redirect('/cart');
});

router.post('/update', (req, res) => {
  const { id, qty } = req.body;
  if (!req.session.cart || !req.session.cart.items[id]) {
    return res.redirect('/cart');
  }
  const quantity = parseInt(qty, 10);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    delete req.session.cart.items[id];
  } else {
    req.session.cart.items[id].qty = quantity;
  }
  recalcCart(req.session.cart);
  res.redirect('/cart');
});

router.post('/remove', (req, res) => {
  const { id } = req.body;
  if (req.session.cart && req.session.cart.items[id]) {
    delete req.session.cart.items[id];
    recalcCart(req.session.cart);
  }
  res.redirect('/cart');
});

router.post('/clear', (req, res) => {
  req.session.cart = { items: {}, totalQty: 0, totalPrice: 0 };
  res.redirect('/cart');
});

module.exports = router;
