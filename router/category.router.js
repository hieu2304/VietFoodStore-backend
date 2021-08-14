const express = require('express');
const controller = require('../controller/category.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.get('/', controller.getAll);
router.get('/fatherCategory', controller.getAllFatherCategory);
router.get('/subCategory', controller.getAllSubCategory);
router.get('/:id', authMiddleware.isAuth, controller.getById);
router.post('/', controller.add);
router.post('/addFatherCategory', controller.addFatherCategory);
router.get('/delete/:id', authMiddleware.isAuth, controller.delete);
router.post('/update', authMiddleware.isAuth, controller.update);
module.exports = router;