const Account = require('../model/account.model');
const asyncHandler = require('express-async-handler');
const jwtHelper = require('../lib/jwt');
const authConfigs = require('../config/index');
const authConfig = authConfigs[authConfigs.environment].auth;

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers['x-access-token'], authConfig.tokenSecretKey);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    if (currentUser.role == 2 || currentUser == 3) {
        let result = await Account.getAll(currentUser);
        if (!result) return res.status(400).send({ message: 'Get failed' });
        return res.status(200).send(result);
    }
    return res.status(422).send({ statusCode: 1, message: "not permission" })
});

module.exports.getAccount = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers['x-access-token'], authConfig.tokenSecretKey);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    if (currentUser.role == 2 || currentUser == 3) {
        const result = await Account.getAccount(req.query);
        if (result.length <= 0) {
            return res.status(400).send({ statusCode: 1, message: 'Get failed' });
        }
        return res.status(200).send(result);
    }
    return res.status(422).send({ statusCode: 1, message: "not permission" })
});

module.exports.updateRole = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers['x-access-token'], authConfig.tokenSecretKey);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    if (currentUser.role == 2 || currentUser == 3) {
        const result = await Account.updateRole(req.body);
        if (!result) {
            return res.status(400).send({ statusCode: 1, message: 'update failed' });
        }
        return res.status(200).send(result);
    }
    return res.status(422).send({ statusCode: 1, message: "not permission" })
});
