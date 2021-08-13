const knex = require('../util/knex');
const _ = require('lodash');

async function getCommentByProductId(productId) {
    const data = await knex.select('comments.id', 'acc_id', 'content', 'vote', 'comments.status', 'prod_id', 'username', 'fullName', 'email')
    .from('comments')
    .where({
        prod_id: productId
      })
    .join('accounts', 'comments.acc_id', '=', 'accounts.id');
    return data;
}

async function getList(params) {
    const result = await knex('comments').where('id',params);
    return result;
}

async function add(comment) {
    return knex('comments').insert(comment);
}

module.exports = {
    getCommentByProductId,
    getList,
    add
};