const Stock = require('../model/stock.model');
const asyncHandler = require('express-async-handler');

/**
 * controller Stock pending
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Stock.getAll();
    if (!result) return res.status(400).send({ message: 'Get stock failed' });
    return res.status(200).send(result);
});

module.exports.getById = asyncHandler(async function (req, res, next) {
    let stockId = + req.params.id || 0;
    let result = await Stock.findById(stockId);
    if(result === null) {
        return res.status(204).end();
    }
    return res.status(200).send(result);
});


module.exports.add = asyncHandler(async function (req, res, next) {
    const stock = req.body;
    const result = await Stock.add(stock);
    stock.id = result[0];
    res.json(stock);
});

module.exports.delete = asyncHandler(async function (req, res, next) {
    let stockId = + req.params.id || 0;
    let affectiveRow = await Stock.deleteById(stockId);
    if(affectiveRow === 0) {
        return res.json({
            message: "No stock delete"
        });
    }
    res.json({
        message: 'Stock deleted success'
    })
});

module.exports.update = asyncHandler(async function (req, res, next) {
    const stock = req.body;
    const stock_id = req.body.id
    delete stock.id;
    const affective_rows = await Stock.update(stock_id, stock);
    if(affective_rows === 0) {
        return res.status(304).end();
    }
    res.json(stock);
});