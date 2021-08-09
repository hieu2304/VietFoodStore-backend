const authConfigs = require('../config/index');
const authConfig = authConfigs[authConfigs.environment].auth;
const jwtHelper = require("../lib/jwt");
const Account = require("../model/auth.model");
const validate = require("../lib/validate");
const mailService = require('../lib/mail');
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
module.exports.login = async (req, res) => {
    try {
        const { error, value } = validate.checkAuth(req.body);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body
            })
        } else {
            const result = await Account.login(value.email, value.passWord);
            const accessToken = jwtHelper.generateToken(result, process.env.SECRET_KEY, '1h');
            const refreshToken = jwtHelper.generateToken(result, process.env.REFRESH_KEY, '30D');
            await Account.addRefreshToken(value.email, refreshToken);
            return res.status(200).json({ accessToken, refreshToken });
        }
    } catch (error) {
        res.send({ code: error.code, message: error.message || undefined });
    }
}
/**
 * controller register
 * @param {*} req 
 * @param {*} res 
 */
module.exports.register = async (req, res) => {
    try {
        const { error, value } = validate.checkRegister(req.body);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body
            })
        } else {
            const user = await Account.findUserByKey(value.email);
            if (user.length > 0) {
                return res.status(409).json({ message: 'Account exist' });
            }
            const cusName = req.body.fullName || 'người dùng';
            let activeCode = (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString()
            await mailService.sendMail(value.email, cusName, activeCode, req, res);
            await Account.register(req.body, activeCode);
            return res.status(201).json({ statusCode: 0, message: 'Register success' });
        }

    } catch (error) {
        res.send({ code: error.code, message: error.message || undefined });
    }
}
/**
 * controller logout
 * @param {*} req 
 * @param {*} res 
 */
module.exports.logout = async (req, res) => {
    return res.status(200).send({ message: 'OK' });
}
/**
 * controller refreshToken
 * @param {*} req 
 * @param {*} res 
 */
module.exports.refreshToken = async (req, res) => {
    const refreshTokenFromClient = req.body.refreshToken;
    const result = await Account.refreshToken(refreshTokenFromClient);
    if (refreshTokenFromClient && result.length > 0) {
        try {
            const dataUser = {
                id: result[0].id,
                role_id: result[0].role_id
            }
            const accessToken = jwtHelper.generateToken(dataUser, process.env.SECRET_KEY, '1h');
            return res.status(200).json({ accessToken });
        } catch (error) {
            res.status(403).json({
                message: 'Invalid refresh token.',
            });
        }
    } else {
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
};

/**
 * controller verify
 * @param {*} req 
 * @param {*} res 
 */
module.exports.VerifyEmail = async (req, res) => {
    try {
        const result = await Account.verifyCode(req.body);
        if (result) {
            return res.status(201).json({ statusCode: 0, message: 'Verify success' });
        }
        return res.status(400).json({ statusCode: 1, message: 'Verify failed' });
    } catch (error) {
        res.send({ code: error.code, message: error.message || undefined });
    }
};

/**
 * controller forgotPass
 * @param {*} req 
 * @param {*} res 
 */
module.exports.forgotPassword = async (req, res) => {
    try {
        const result = await Account.forgotPassword(req.body);
        if (result) {
            const cusName = result[0].fullName || 'người dùng';
            let activeCode = (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString()
            await Account.updateForgotCode(activeCode, result[0]);
            await mailService.sendMail(req.body.email, cusName, activeCode, req, res);
            return res.status(201).json({ statusCode: 0, message: 'Email exist' });
        }
        return res.status(200).json({ statusCode: 1, message: 'Email not exist' });
    } catch (error) {
        res.send({ code: error.code, message: error.message || undefined });
    }
};
