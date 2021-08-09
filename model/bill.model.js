const knex = require('../util/knex');
const _ = require('lodash');

async function getDetails(params) {
    const data = await knex('bill_details').where({ bill_id:params.billId});
    return data;
}

async function getList(params) {
    const result = await knex('bills').where('acc_id',params);
    return result;
}

module.exports = {
    getDetails,
    getList
};