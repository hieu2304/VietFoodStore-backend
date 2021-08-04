const express = require('express');
const router = express.Router();


router.use('/auth',require('./router/auth.router'));
router.use('/accounts',require('./router/account.router'));


module.exports = router;