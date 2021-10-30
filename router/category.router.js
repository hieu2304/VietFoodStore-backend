const express = require('express');
const controller = require('../controller/category.controller');
const router = express.Router();

router.get('/list', controller.getAllFatherSubCategory);
router.get('/list-father', controller.getAllFatherCategory);
router.post('/list-child', controller.getSubCategoryByFatherId);
router.get('/subCategory', controller.getAllSubCategory);
router.post('/auth-categories/add-father', controller.addFatherCategory);
router.post('/auth-categories/add-child', controller.addSubCategoryByFatherId);
router.post('/addFatherSubCategory', controller.addFatherSubCategory);
router.post('/auth-categories/delete', controller.delete);
router.post('/update', controller.update); //update basic
router.post('/auth-categories/update', controller.updateFatherSubCategory);
router.get('/product-with-cate',controller.productWithCate);
module.exports = router;