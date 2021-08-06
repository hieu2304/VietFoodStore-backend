const knex = require('../util/knex');
const _ = require('lodash');

async function getAll() {
    const data = await knex('categories');
    return data;
}

async function findById(id) {
    const data = await knex('categories').where('id', id);
    if(data.length === 0) {
        return null;
    }
    return data[0];
}

async function add(category) {
    return knex('categories').insert(category);
}

async function deleteById(id) {
    return knex('categories').where('id', id).del();
}

async function update(id, categoryWithoutId) {
    return knex('categories').where('id', id).update(categoryWithoutId);
}

module.exports = {
    getAll,
    findById,
    add,
    deleteById,
    update
};