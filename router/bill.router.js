const express = require('express');
const controller = require('../controller/bill.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.post('/details', controller.getDetails);
router.get('/history-bill/:id?', controller.getBill);
router.post('/add', authMiddleware.isAuth, controller.addBill);
router.post('/cancel-bill', authMiddleware.isAuth, controller.cancelBill);
router.post('/list', authMiddleware.isAuth, controller.getListBill); //4/ Lấy danh sách đơn hàng
router.post('/update-status', authMiddleware.isAuth, controller.updateStatus);

module.exports = router;