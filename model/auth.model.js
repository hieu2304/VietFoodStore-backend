const knex = require('../util/knex');
const _ = require('lodash');
const bcrypt = require('bcrypt');

function verifyPassword(passwordsUnHashed, passwordsHashed) {
    return bcrypt.compareSync(passwordsUnHashed, passwordsHashed);
}
function hashPassword(passwordInput) {
    return bcrypt.hashSync(passwordInput, 10);
}

async function login(username, password) {
    const authUser = await knex('accounts').where('username', username).orWhere('email', username);
    if (!verifyPassword(password, authUser[0].password)) {
        return null;
    }
    const result = {
        accId: authUser[0].id,
        role: 'ADM',
        accStatus:authUser[0].status
    }
    return result;
}

async function verifyCode(params) {
    const result = await knex('accounts').where('activeCode', params.accToken);
    if (result.length <= 0) {
        return null;
    }
    await knex('accounts').update('status',0).where('id', params.accId);
    return result;
}

async function addRefreshToken(username, refreshToken) {
    await knex('accounts').update('refreshToken', refreshToken).where('username', username);
}

async function findUserByKey(username) {
    const User = await knex('accounts').where('username', username).orWhere('email', username);
    return User;
}

async function register(params,code) {
    let temp = params;
    temp.password = hashPassword(params.passWord);
    temp.username = params.email;
    temp.activeCode = code;
    temp.create_date = new Date();
    const fields = ['username', 'password', 'email', 'phoneNumber', 'fullName','activeCode','create_date'];
    const data = _.pick(temp, fields);
    const result = await knex('accounts').returning('id').insert(data);
    return result;
}

async function forgotPassword(params) {
    const result = await knex('accounts').where('email', params.email);
    if (result.length <= 0) {
        return null;
    }
    return result;
}
async function refreshToken(params) {
    const result = await knex('accounts').where('refreshToken', params);
    return result;
}

async function updateForgotCode(code,params) {
    const result = await knex('accounts').update('forgotCode',code).where('email', params.email);
    return result;
}

async function findById(params){
    const result = await knex('accounts').where('id', params);
    return result;
}

async function newPassword(params,id){
    let password = hashPassword(params);
    const result = await knex('accounts').update('password',password).where('id',id);
    return result;
}

module.exports = {
    login,
    findById,
    register,
    findUserByKey,
    addRefreshToken,
    refreshToken,
    verifyCode,
    forgotPassword,
    updateForgotCode,
    newPassword
};