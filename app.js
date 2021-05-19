require('dotenv').config()

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const addressRouter = require('./routes/address')
const adminRouter = require('./routes/admin')
const categoryRouter = require('./routes/category')
const sellerRouter = require('./routes/seller')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const checkoutRouter = require('./routes/checkout')
const orderRouter = require('./routes/order')
const callback = require('./routes/callback')

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/address', addressRouter)
app.use('/admin', adminRouter)
app.use('/category', categoryRouter)
app.use('/seller', sellerRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/checkout', checkoutRouter)
app.use('/order', orderRouter)
app.use('/callback', callback)

module.exports = app;
