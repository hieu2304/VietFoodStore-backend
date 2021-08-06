const Stock = require('../model/stock.model');
const asyncHandler = require('express-async-handler');

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Stock.getAll();
    if (!result) return res.status(400).send({ message: 'Get stock failed' });
    return res.status(200).send(result);
});
