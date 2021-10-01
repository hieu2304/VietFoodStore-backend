const express = require('express');
const controller = require('../controller/account.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.get('/list',authMiddleware.isAuth,controller.getAll);
router.get('/details/:id?',authMiddleware.isAuth,controller.getAccount);
router.post('/update',authMiddleware.isAuth,controller.update); //2/Update account
router.delete('/delete/:id?',authMiddleware.isAuth,controller.deleteAccount);
router.post('/update-role',authMiddleware.isAuth,controller.updateRole);
router.post('/update-status',authMiddleware.isAuth,controller.updateStatus); //8/Update Status

module.exports = router;