const Product = require('../model/product.model');
const asyncHandler = require('express-async-handler');

/**
 * controller get all Product
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Product.getAll();
    var prodList = []
    var index = 0
    while (index < result.length) {
        let prodObj = {
            prod_id: result[index].id,
            prod_name: result[index].prod_name,
            prod_category_id: result[index].cate_id,
            prod_amount: result[index].amount,
            prod_created_date: result[index].created_date,
            prod_updated_date: result[index].updated_date,
            prod_price: result[index].price
        }
        let imageLink = []
        for (let i = index; i < result.length; i++) {
            index = i + 1
            imageLink.push(result[i].data)

            if ((i >= result.length - 1) || (i != 0 && result[index].id != result[index - 1].id)) {
                break;
            }
        }
        prodObj['images'] = imageLink
        prodList.push(prodObj)
    }
    if (result) {
        return res.status(200).json({
            listProduct: prodList,
            statusCode: 0
        })
    }
    else {
        return res.status(500).json({
            listProduct: [],
            statusCode: 1
        })
    }
});

/**
 * controller get top month Product
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getTopMonth = asyncHandler(async function (req, res, next) {
    let result = await Product.getTopMonth();
    if (!result) return res.status(400).send({ message: 'Get failed' });
    let topOfMonth = [result[0], result[1], result[3], result[10], result[4]]
    return res.status(200).send(topOfMonth);
});

module.exports.getSuggestion = asyncHandler(async function (req, res, next) {
    let result = await Product.getSuggestion();
    if (!result) return res.status(400).send({ message: 'Get failed' });
    var prodList = []
    var index = 0
    while (index < result.length) {
        let prodObj = {
            prod_id: result[index].id,
            prod_name: result[index].prod_name,
            prod_category_id: result[index].cate_id,
            vote: result[index].vote,
            prod_amount: result[index].amount,
            prod_created_date: result[index].created_date,
            prod_updated_date: result[index].updated_date,
            prod_price: result[index].price
        }
        let imageLink = []
        for (let i = index; i < result.length; i++) {
            index = i + 1
            imageLink.push(result[i].data)

            if ((i >= result.length - 1) || (i != 0 && result[index].id != result[index - 1].id)) {
                break;
            }
        }
        prodObj['images'] = imageLink
        prodList.push(prodObj)
    }
    if (result) {
        return res.status(200).json({
            listProduct: prodList,
            statusCode: 0
        })
    }
    else {
        return res.status(500).json({
            listProduct: [],
            statusCode: 1
        })
    }
});