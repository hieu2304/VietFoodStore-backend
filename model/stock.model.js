const knex = require('../util/knex');
const _ = require('lodash');

const findByAccAndProduct = async (accId, prodId) => {
	const info = await knex('carts')
					.where({ acc_id: accId, prod_id: prodId })

    return info
}

const findByAcc = async (accId) => {
	const info = await knex('carts')
					.where({ acc_id: accId })

    return info
}

const findById = async (cartId) => {
	const info = await knex('carts')
					.where({ id: cartId })

    return info
}

const updateCart = async (cartId, cartObject) => {
	const returnInfo = await knex('carts')
			.update(cartObject)
			.where({ id: cartId }).returning('id')

	return returnInfo[0]
}


const addcart = async (cartObject) => {
	const returnInfo = await knex('carts')
			.insert(cartObject).returning('id')

	return returnInfo[0]
}

const deleteCart = async (cartId) => {
    const del = await knex('carts').where({ id: cartId }).del()
    return del;
}
module.exports = {
	findByAccAndProduct,
	findByAcc,
    deleteCart,
	updateCart,
	addcart,
	findById
};