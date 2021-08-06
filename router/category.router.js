const express = require('express');
const controller = require('../controller/category.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.add);

module.exports = router;