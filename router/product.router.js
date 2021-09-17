const express = require('express');
const controller = require('../controller/product.controller');
const router = express.Router();

router.post('/list',controller.getAll);
router.get('/detail/:id?',controller.getDetail);
router.post('/list-best-sale',controller.getTopMonth);
router.post('/list-suggestion',controller.getSuggestion);
router.post('/list-by-cat',controller.getListByCart)
router.post('/search',controller.search)
module.exports = router;