const knex = require('../util/knex');
const _ = require('lodash');

async function getAll() {
    const data = await knex.from('products')
		.join('product_images', 'products.id', '=', 'product_images.prod_id')
    return data;
}

async function getTopMonth() {
    const data = await knex('products');
    return data;
}

module.exports = {
    getAll,
    getTopMonth
};