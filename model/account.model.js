const knex = require('../util/knex');
const _ = require('lodash');

async function getAll(staff) {
    const data = await knex('accounts');
    return data;
}

async function getAccount(params) {
    let id = parseInt(params.id)
    const data = await knex('accounts').where('id',id);
    return data;
}

async function updateRole(params) {
    let id = parseInt(params.accId)
    const data = await knex('accounts').update('role_id',params.accRole).where('id',id);
    return data;
}

module.exports = {
    getAll,
    getAccount,
    updateRole
};