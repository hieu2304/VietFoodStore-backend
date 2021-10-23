const knex = require('../util/knex');
const _ = require('lodash');

async function getDetails(billId) {
    const data = await knex.raw(`
    select 
        a.prod_id productID, b."name" prodName, c."name" prodCategory, a.quantity prodQuantity, 
        b.description prodDescription, c.create_date prodCreatedDate, c.update_date prodUpdatedDate,
        b.price prodPrice
    from 
        bill_details a, products b, categories c
    where 
        a.prod_id = b.id
        and a.bill_id = ${billId}
        and b.cate_id = c.id;` );
    return data.rows;
}

async function getBillById(billId) {
    const data = await knex('bills').where({ id: billId});
    return data;
}

async function getList(userId, status) {
    var result = null;
    if (status) {
        result = await knex('bills').where({ 'acc_id':userId, 'status': status });
    }else {
        result = await knex('bills').where({ 'acc_id':userId });
    }
    return result;
}

async function add(bill) {
    return knex('bills').insert(bill).returning('id');
}

async function addBillDetail(bill_detail) {
    return knex('bill_details').insert(bill_detail);
}

async function cancelBill(params) {
    return knex('bills').update('status',1).where('id',params.id);
}

async function updateStatusBill(params, billId) {
    return knex('bills').where('id', billId).update(params);
}

module.exports = {
    getDetails,
    getList,
    add,
    addBillDetail,
    cancelBill,
    getBillById,
    updateStatusBill
};