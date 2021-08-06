const knex = require('../util/knex');
const _ = require('lodash');

async function getAll() {
    const data = await knex('stocks');
    return data;
}


module.exports = {
    getAll,
};