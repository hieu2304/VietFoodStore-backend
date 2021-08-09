const express = require('express');
const controller = require('../controller/stock.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.get('/', authMiddleware.isAuth, controller.getAll);
router.get('/:id', authMiddleware.isAuth, controller.getById);
router.post('/', authMiddleware.isAuth, controller.add);
router.get('/delete/:id', authMiddleware.isAuth, controller.delete);
router.post('/update', authMiddleware.isAuth, controller.update);

module.exports = router;