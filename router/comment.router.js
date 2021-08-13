const express = require('express');
const controller = require('../controller/comment.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.get('/product/:productId',controller.getListCommentByProductId);
router.post('/', authMiddleware.isAuth, controller.addComment)

module.exports = router;