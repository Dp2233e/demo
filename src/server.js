require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'toyshop_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = { items: {}, totalQty: 0, totalPrice: 0 };
  }
  const totalQty = Object.values(req.session.cart.items).reduce((sum, it) => sum + it.qty, 0);
  req.session.cart.totalQty = totalQty;
  res.locals.cartCount = totalQty;
  next();
});

app.use('/', require('./routes/index'));
app.use('/cart', require('./routes/cart'));

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form submission:', { name, email, message });
  res.render('contact', { title: 'Contact', submitted: true });
});

app.use((req, res) => res.status(404).render('404', { title: 'Page Not Found' }));

app.listen(PORT, () => console.log(`Toy Shop listening on http://localhost:${PORT}`));
