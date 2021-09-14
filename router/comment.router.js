const express = require('express');
const controller = require('../controller/comment.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.post('/list',controller.getListCommentByProductId);
router.post('/add', authMiddleware.isAuth, controller.addComment)
router.post('/update', authMiddleware.isAuth, controller.updateComment)
router.post('/delete',authMiddleware.isAuth, controller.deleteComment)

module.exports = router;