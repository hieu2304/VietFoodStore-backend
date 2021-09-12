const express = require('express');
const controller = require('../controller/comment.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.post('/list',controller.getListCommentByProductId);
router.post('/add', controller.addComment)

module.exports = router;