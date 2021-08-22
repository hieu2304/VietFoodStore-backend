const express = require('express');
const controller = require('../controller/product.controller');
const router = express.Router();

router.get('/list',controller.getAll);
router.get('/list-suggestion',controller.getTopMonth);

module.exports = router;