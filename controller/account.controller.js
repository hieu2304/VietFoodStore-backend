const Account = require('../model/account.model');
const asyncHandler = require('express-async-handler');

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Account.getAll();
    if (!result) return res.status(400).send({ message: 'Get failed' });
    return res.status(200).send(result);
});
