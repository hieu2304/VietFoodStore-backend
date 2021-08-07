const Account = require('../model/account.model');
const asyncHandler = require('express-async-handler');
const jwtHelper = require('../lib/jwt');
const validate = require('../lib/validate');

/**
 * controller get list account
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getAll = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    if (currentUser.role == 2 || currentUser.role == 3) {
        let result = await Account.getAll(currentUser);
        if (!result) return res.status(400).send({ message: 'Get failed' });
        return res.status(200).send(result);
    }
    return res.status(422).send({ statusCode: 1, message: "not permission" })
});

/**
 * controller get Account
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getAccount = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    if (currentUser.role == 2 || currentUser.role == 3) {
        const result = await Account.getAccount(req.query);
        if (result.length <= 0) {
            return res.status(400).send({ statusCode: 1, message: 'Get failed' });
        }
        return res.status(200).send(result);
    }
    return res.status(422).send({ statusCode: 1, message: "not permission" })
});

/**
 * controller update Role user
 * @param {*} req 
 * @param {*} res 
 */
module.exports.updateRole = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    if (currentUser.role == 2 || currentUser.role == 3) {
        const { error, value } = validate.checkBillDetails(req.body);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body
            })
        } else {
            const result = await Account.updateRole(value);
            if (!result) {
                return res.status(400).send({ statusCode: 1, message: 'update failed' });
            }
            return res.status(200).send(result);
        }
    }
    return res.status(422).send({ statusCode: 1, message: "not permission" })
});
