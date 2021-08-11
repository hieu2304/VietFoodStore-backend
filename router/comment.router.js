const express = require('express');
const controller = require('../controller/comment.controller');
const router = express.Router();

router.get('/product/:productId',controller.getListCommentByProductId);

module.exports = router;