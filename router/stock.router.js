const express = require('express');
const controller = require('../controller/stock.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.get('/',authMiddleware.isAuth,controller.getAll);

module.exports = router;