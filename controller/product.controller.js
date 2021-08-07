const Product = require('../model/product.model');
const asyncHandler = require('express-async-handler');

/**
 * controller get all Product
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Product.getAll();
    if (!result) return res.status(400).send({ message: 'Get failed' });
    return res.status(200).send(result);
});

/**
 * controller get top month Product
 * @param {*} req 
 * @param {*} res 
 */

 module.exports.getTopMonth = asyncHandler(async function (req, res, next) {
    let result = await Product.getTopMonth();
    if (!result) return res.status(400).send({ message: 'Get failed' });
    let topOfMonth = [result[0],result[1],result[3],result[10],result[4]]
    return res.status(200).send(topOfMonth);
});