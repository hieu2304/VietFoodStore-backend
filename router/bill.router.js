const express = require('express');
const controller = require('../controller/bill.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.post('/list-details',authMiddleware.isAuth,controller.getDetails);
router.get('/history-bill/:id?',authMiddleware.isAuth,controller.getBill);

module.exports = router;