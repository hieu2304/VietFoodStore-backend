const express = require('express');
const router = express.Router();

router.use('/accounts',require('./router/account.router'));
router.use('/cities',require('./router/city.router'));
router.use('/districts',require('./router/district.router'));
router.use('/authentication',require('./router/auth.router'));
router.use('/categories',require('./router/category.router'));
router.use('/bill',require('./router/bill.router'));
router.use('/products',require('./router/product.router'))
router.use('/comment',require('./router/comment.router'));
router.use('/delivery',require('./router/delivery-address.router'));

module.exports = router;