const knex = require('../util/knex');
const _ = require('lodash');

async function getCommentByProductId(productId) {
    const data = await knex.select('comments.id', 'acc_id', 'content', 'star', 'comments.status', 'prod_id', 'username', 'fullName', 'email')
    .from('comments')
    .where({
        prod_id: productId
      })
    .join('accounts', 'comments.acc_id', '=', 'accounts.id');
    return data;
}

async function getNumberOfUserComment(productId) {
    const data = await knex.raw(`
    select count(acc_id) numberOfUserComment
    from "comments" a
    where a.prod_id = ${productId}
    group by a.acc_id` );
    return data.rows[0];
}

async function getAvgStar(productId) {
    const data = await knex.raw(`
    select round(AVG(a.vote))
    from "comments" a
    where a.prod_id = ${productId}` );
    return data.rows[0];
}

async function countNumberStar(productId, number) {
    const data = await knex.raw(`
    select count(a.*)
    from "comments" a
    where a.prod_id = ${productId}
    and a.vote = ${number}` );
    return data.rows[0];
}

async function getList(params) {
    const result = await knex('comments').where('id',params);
    return result;
}

async function add(comment) {
    return knex('comments').insert(comment);
}

async function update(id, commentWithoutId) {
    return knex('comments').where('id', id).update(commentWithoutId);
}

async function deleteComment(id) {
    return knex('comments').where('id', id).update({'status': 0});
}

module.exports = {
    getCommentByProductId,
    getList,
    add,
    getNumberOfUserComment,
    getAvgStar,
    countNumberStar,
    update,
    deleteComment
};