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

async function addRefreshToken(username, refreshToken) {
    await knex('accounts').update('refreshToken', refreshToken).where('username', username);
}

async function findUserByKey(username) {
    const User = await knex('accounts').where('username', username).orWhere('email', username);
    return User;
}

async function register(params) {
    let temp = params;
    temp.password = hashPassword(params.password);
    const fields = ['username', 'password', 'email', 'phoneNumber', 'fullName'];
    const data = _.pick(temp, fields);
    await knex('accounts').insert(data);
}

async function refreshToken(params) {
    const result = await knex('accounts').where('refreshToken', params);
    return result;
}

module.exports = {
    login,
    register,
    findUserByKey,
    addRefreshToken,
    refreshToken
};