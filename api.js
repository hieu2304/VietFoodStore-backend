const express = require('express');
const router = express.Router();

router.use('/accounts',require('./router/account.router'));
router.use('/cities',require('./router/city.router'));
router.use('/districts',require('./router/district.router'));
router.use('/authentication',require('./router/auth.router'));
router.use('/stocks',require('./router/stock.router'));
router.use('/categories',require('./router/category.router'));
router.use('/bills',require('./router/bill.router'));
router.use('/products',require('./router/product.router'))

module.exports = router;