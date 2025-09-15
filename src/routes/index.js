const express = require('express');
const router = express.Router();
const products = require('../data/products');

router.get('/', (req, res) => {
  res.render('home', { title: 'Home', products });
});

router.get('/shop', (req, res) => {
  res.render('shop', { title: 'Shop', products });
});

router.get('/product/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).render('404', { title: 'Not Found' });
  }
  res.render('product', { title: product.name, product });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

module.exports = router;
