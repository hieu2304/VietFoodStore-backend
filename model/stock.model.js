const knex = require('../util/knex');
const _ = require('lodash');

async function getAll() {
    const data = await knex('stocks');
    return data;
}

async function findById(id) {
    const data = await knex('stocks').where('id', id);
    if(data.length === 0) {
        return null;
    }
    return data[0];
}

async function add(stock) {
    return knex('stocks').insert(stock);
}

async function deleteById(id) {
    return knex('stocks').where('id', id).del();
}

async function update(id, stockWithoutId) {
    return knex('stocks').where('id', id).update(stockWithoutId);
}


module.exports = {
    getAll,
    findById,
    add,
    deleteById,
    update
};