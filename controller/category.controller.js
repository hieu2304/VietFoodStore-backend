const Category = require('../model/category.model');
const asyncHandler = require('express-async-handler');
const validate = require("../lib/validate");

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Category.getAll();
    if (!result) return res.status(400).send({ 
        message: 'Get categories failed' ,
        statusCode: 1
    });
    return res.status(200).send({
        listCategory: result,
        statusCode: 0
    });
});

module.exports.getAllFatherCategory = asyncHandler(async function (req, res, next) {
    let result = await Category.getAllFatherCategory();
    if (!result) return res.status(400).send({ 
        message: 'Get categories failed' ,
        statusCode: 1
    });
    return res.status(200).send({
        listCategory: result,
        statusCode: 0
    });
});

module.exports.getAllSubCategory = asyncHandler(async function (req, res, next) {
    let result = await Category.getAllSubCategory();
    if (!result) return res.status(400).send({ 
        message: 'Get categories failed' ,
        statusCode: 1
    });
    return res.status(200).send({
        listCategory: result,
        statusCode: 0
    });
});

module.exports.getById = asyncHandler(async function (req, res, next) {
    let categoryId = + req.params.id || 0;
    let result = await Category.findById(categoryId);
    if(result === null) {
        return res.status(204).end();
    }
    return res.status(200).json({
        listCategory: result,
        statusCode: 0
    });
});


module.exports.add = asyncHandler(async function (req, res, next) {
    const category = req.body;
    category.create_date = new Date();
    const result = await Category.add(category);
    category.id = result[0];
    res.json(category);
});

module.exports.addFatherCategory = asyncHandler(async function (req, res, next) {
//     category_name: 'category_new',
//     sub_category: [{id: 2, name: 'category_sub1'}, {id: 3, name: 'category_sub2'}]
    try {
        const { error, value } = validate.checkCategoryAddFather(req.body);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body,
                statusCode: 1
            })
        } else {
            const fatherCategoryName = req.body.category_name;
            const fatherCategory = {
                name: fatherCategoryName,
                father_id: 0,
                create_date: new Date()
            }

            const result = await Category.add(fatherCategory);

            //get id father category
            const resultFatherCategory = await Category.findByName(fatherCategoryName);
            if(resultFatherCategory === null) {
                return res.status(204).json({
                    message: 'No get category',
                    statusCode: 1
                });
            }
            fatherCategoryId = resultFatherCategory.id;

            //update fatherid in sub_category
            const listSubCategory = req.body.sub_category;

            listSubCategory.forEach(async(element)  => {
                let sub_cate = {
                    father_id: fatherCategoryId,
                    update_date: new Date()
                }
                await Category.update(element.id, sub_cate);
            });
        }
    } catch (error) {
        return res.status(404).json({
            message: error,
            statusCode: 1
        })
    }
    res.json({
        message: 'Category create success',
        statusCode: 0,
        fatherCategoryId
    })
});

module.exports.delete = asyncHandler(async function (req, res, next) {
    let categoryId = + req.params.id || 0;
    let affectiveRow = await Category.deleteById(categoryId);
    if(affectiveRow === 0) {
        return res.json({
            message: "No category delete"
        });
    }
    res.json({
        message: 'Category deleted success'
    })
});

module.exports.update = asyncHandler(async function (req, res, next) {
    const category = req.body;
    const category_id = req.body.id
    delete category.id;
    const affective_rows = await Category.update(category_id, category);
    if(affective_rows === 0) {
        return res.status(304).end();
    }
    res.json(category);
});