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
        id: authUser[0].id,
        role: authUser[0].role_id
    }
    return result;
}

async function verifyCode(params) {
    const result = await knex('accounts').where('activeCode', params.accToken);
    if (result.length <= 0) {
        return null;
    }
    await knex('accounts').update('status',1).where('id', params.accId);
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
    const fields = ['username', 'password', 'email', 'phoneNumber', 'fullName','activeCode'];
    const data = _.pick(temp, fields);
    await knex('accounts').insert(data);
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


module.exports = {
    login,
    register,
    findUserByKey,
    addRefreshToken,
    refreshToken,
    verifyCode,
    forgotPassword,
    updateForgotCode,
};