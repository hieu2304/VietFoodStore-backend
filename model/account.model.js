const knex = require('../util/knex');
const _ = require('lodash');
const bcrypt = require('bcrypt');

async function getAll(staff) {
    const data = await knex('accounts');
    return data;
}

async function getAccount(params) {
    const data = await knex('accounts').where('id',params);
    return data;
}

async function updateRole(params) {
    const data = await knex('accounts').update('role_id',params.accRole).where('id',params.accId);
    return data;
}

async function updateAccount(params, accountId) {
    const data = await knex('accounts').update(params).where('id', accountId);
    return data;
}

async function updateAccountStatus(params, accountId) {
    const data = await knex('accounts').update(params).where('id', accountId);
    return data;
}

async function deleteAccount(params) {
    const data = await knex('accounts').update('status',1).where('id',params);
    return data;
}

async function updatePassword(password,id){
    let account = {
        password: bcrypt.hashSync(password, 10),
        update_date:new Date()
    }
    const data = await knex('accounts').update(account).where('id',id);
    return data;
}

module.exports = {
    getAll,
    getAccount,
    updateRole,
    deleteAccount,
    updatePassword,
    updateAccount,
    updateAccountStatus
};