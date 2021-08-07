const knex = require('../util/knex');
const _ = require('lodash');

async function getDetails(params) {
    const data = await knex('bills').where({ acc_id: params.accId, id: params.billId});
    const result = await knex('bill_details')
        .where({ id:data[0].id})
    return result;
}

async function getList(params) {
    const result = await knex('bills').where('acc_id',params);
    return result;
}

module.exports = {
    getDetails,
    getList
};