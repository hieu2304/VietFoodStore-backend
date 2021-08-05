const Districts = require('../model/districts.model');
const asyncHandler = require('express-async-handler');

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Districts.getAll();
    if (!result) return res.status(400).send({ message: 'Get failed' });
    return res.status(200).send(result);
});