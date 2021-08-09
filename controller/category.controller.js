const Category = require('../model/category.model');
const asyncHandler = require('express-async-handler');

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Category.getAll();
    if (!result) return res.status(400).send({ message: 'Get categories failed' });
    return res.status(200).send(result);
});

module.exports.getById = asyncHandler(async function (req, res, next) {
    let categoryId = + req.params.id || 0;
    let result = await Category.findById(categoryId);
    if(result === null) {
        return res.status(204).end();
    }
    return res.status(200).send(result);
});


module.exports.add = asyncHandler(async function (req, res, next) {
    const category = req.body;
    const result = await Category.add(category);
    category.id = result[0];
    res.json(category);
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