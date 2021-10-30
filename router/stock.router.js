const express = require('express');
const controller = require('../controller/stock.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.get('/list',authMiddleware.isAuth,controller.getList);
router.post('/add',authMiddleware.isAuth,controller.addCart)
router.post('/update-amount',controller.updateAmount);
router.post('/check-price',controller.checkPrice);
router.post('/delete',controller.deleteCart);
module.exports = router;