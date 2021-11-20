const express = require('express');
const router = express.Router();

router.use('/account',require('./router/account.router'));
router.use('/cities',require('./router/city.router'));
router.use('/districts',require('./router/district.router'));
router.use('/authentication',require('./router/auth.router'));
router.use('/categories',require('./router/category.router'));
router.use('/bill',require('./router/bill.router'));
router.use('/product',require('./router/product.router'))
router.use('/comment',require('./router/comment.router'));
router.use('/delivery',require('./router/delivery-address.router'));
router.use('/cart',require('./router/stock.router'));
router.use('/auth-product',require('./router/auth-product'));
module.exports = router;