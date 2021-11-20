const express = require('express');
const controller = require('../controller/product.controller');
const router = express.Router();


router.post('/add',controller.addProduct);

module.exports = router;