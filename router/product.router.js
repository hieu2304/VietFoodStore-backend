const express = require('express');
const controller = require('../controller/product.controller');
const router = express.Router();

router.get('/',controller.getAll);
router.get('/top-month',controller.getTopMonth);

module.exports = router;