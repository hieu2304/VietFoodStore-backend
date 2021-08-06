const knex = require('../util/knex');
const _ = require('lodash');

async function getAll() {
    const data = await knex('districts');
    return data;
}

module.exports = {
    getAll,
};