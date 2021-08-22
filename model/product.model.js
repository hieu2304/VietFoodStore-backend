const knex = require('../util/knex');
const _ = require('lodash');

async function getAll() {
    const data = await knex.from('products')
		.join('product_images', 'products.id', '=', 'product_images.prod_id')
    return data;
}

async function getTopMonth() {
    const data = await knex.raw(`
        select d.id, d.name, d.cate_id, d.price, e."data", d.amount, d.avg_vote 
        from (
            select a.id,  a."name", a.cate_id, a.price, a.amount, avg(b.vote) avg_vote
            from products a, COMMENTS b
            where a.id= b.prod_id
            AND EXTRACT(MONTH FROM b.create_date) = EXTRACT(MONTH FROM CURRENT_TIMESTAMP)
            group by a.id,  a."name", a.cate_id, a.price, a.amount) d, 
            product_images e
        where d.id= e.prod_id
        order by d.avg_vote DESC
        limit(10)` );
    return data;
}

async function getSuggestion() {
    const data = await knex.raw(`
    select d.id, d.name, d.cate_id, d.price, e."data", d.amount, d.avg_vote 
    from (
        select a.id,  a."name", a.cate_id, a.price, a.amount, avg(b.vote) avg_vote
        from products a, COMMENTS b
        where a.id= b.prod_id
        group by a.id,  a."name", a.cate_id, a.price, a.amount) d, 
        product_images e
    where d.id= e.prod_id
    order by d.avg_vote DESC
    limit(10)`);
    return data;
}


module.exports = {
    getAll,
    getTopMonth,
    getSuggestion
};