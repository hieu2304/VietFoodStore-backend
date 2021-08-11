const express = require('express');
const controller = require('../controller/auth.controller');
const router = express.Router();

router.post('/login',controller.login);
router.post('/register',controller.register);
router.get('/logout',controller.logout);
router.post('/refreshToken',controller.refreshToken);
router.post('/verification-email',controller.VerifyEmail);
router.post('/forgot-password',controller.forgotPassword);
router.post('/new-password',controller.newPassword);
module.exports = router;