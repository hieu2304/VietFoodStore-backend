const Cities = require('../model/city.model');
const asyncHandler = require('express-async-handler');

/**
 * controller get all City
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Cities.getAll();
    if (result.length === 0) return res.status(400).send({ message: 'Get failed' });
    return res.status(200).send(result);
});