const knex = require('../util/knex');
const _ = require('lodash');

async function getAll() {
    const data = await knex('cities');
    return data;
}


module.exports = {
    getAll,
};