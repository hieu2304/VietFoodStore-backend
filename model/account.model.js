const knex = require('../util/knex');
const _ = require('lodash');

async function getAll() {
    const data = await knex('accounts');
    return data;
}


module.exports = {
    getAll,
};