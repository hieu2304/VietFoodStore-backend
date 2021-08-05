const express = require('express');
const router = express.Router();


router.use('/authentication',require('./router/auth.router'));
router.use('/account',require('./router/account.router'));


module.exports = router;