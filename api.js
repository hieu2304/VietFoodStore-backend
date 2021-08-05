const express = require('express');
const router = express.Router();


router.use('/auth',require('./router/auth.router'));
router.use('/accounts',require('./router/account.router'));
router.use('/cities',require('./router/cities.router'));
router.use('/districts',require('./router/districts.router'));
router.use('/authentication',require('./router/auth.router'));

module.exports = router;