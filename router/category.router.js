const express = require('express');
const controller = require('../controller/category.controller');
const authMiddleware = require("../middleware/auth")
const router = express.Router();

router.get('/', controller.getAll);
router.get('/list', controller.getAllFatherSubCategory);///this
router.get('/fatherCategory', controller.getAllFatherCategory);
router.post('/list-child', controller.getSubCategoryByFatherId);
router.get('/subCategory', controller.getAllSubCategory);
router.get('/:id', authMiddleware.isAuth, controller.getById);
router.post('/', controller.add);
router.post('/add-father', controller.addFatherCategory);
router.post('/add-child', controller.addSubCategoryByFatherId);
router.post('/addFatherSubCategory', controller.addFatherSubCategory);
router.post('/delete', authMiddleware.isAuth, controller.delete);
router.post('/update', authMiddleware.isAuth, controller.update); //update basic
router.post('/updateCategory', controller.updateFatherSubCategory);
module.exports = router;