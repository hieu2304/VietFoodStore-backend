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
    console.log(result)
    category.id = result[0];
    res.json(category);
});
