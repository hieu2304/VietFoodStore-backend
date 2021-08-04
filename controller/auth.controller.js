const authConfigs = require('../config/index');
const authConfig = authConfigs[authConfigs.environment].auth;
const jwtHelper = require("../lib/jwt");
const Account = require("../model/auth.model");
/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
module.exports.login = async (req, res) => {
    try {
        const username = req.body.username || req.body.email;
        const result = await Account.login(username, req.body.password);
        const accessToken = jwtHelper.generateToken(result, authConfig.tokenSecretKey,'1h');
        const refreshToken = jwtHelper.generateToken(result, authConfig.refreshTokenSecretKey,'30D');
        await Account.addRefreshToken(username, refreshToken);
        return res.status(200).json({ accessToken, refreshToken });
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
        const username = req.body.username || req.body.email;
        const user = await Account.findUserByKey(username);
        if (user.length > 0) {
            return res.status(409).json({ message: 'Account exist' });
        }
        await Account.register(req.body);
        return res.status(201).json({ message: 'Register success' });
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
            const dataUser ={
                id:result[0].id,
                role_id:result[0].role_id
            }
            const accessToken = jwtHelper.generateToken(dataUser,authConfig.tokenSecretKey,'1h');
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