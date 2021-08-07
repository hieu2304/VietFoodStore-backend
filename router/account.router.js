const express = require('express');
const controller = require('../controller/account.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.get('/list',authMiddleware.isAuth,controller.getAll);
router.get('/details/:id?',authMiddleware.isAuth,controller.getAccount);
router.post('/update-role',authMiddleware.isAuth,controller.updateRole);

module.exports = router;