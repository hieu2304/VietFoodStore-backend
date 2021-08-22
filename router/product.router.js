const express = require('express');
const controller = require('../controller/product.controller');
const router = express.Router();

router.get('/list',controller.getAll);
router.get('/top-month',controller.getTopMonth);
router.get('/get-suggestion',controller.getSuggestion);

module.exports = router;