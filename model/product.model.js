const knex = require('../util/knex');
const _ = require('lodash');

async function getAll() {
    const data = await knex.from('products')
		.join('product_images', 'products.id', '=', 'product_images.prod_id')
    return data;
}

async function getNumberSuggestion(catID) {
    var numberPage = await knex.raw(`select count(distinct products.id) 
	from products join comments on products.id = comments.prod_id
	where products.cate_id = ${catID}`);
    return numberPage;
}
async function getSuggestion(limit,offset,catID){  
	var result = await knex.raw(`with products as(
		select products.*, round(avg(comments.vote),2) as avgStar
		from products join comments on products.id = comments.prod_id
		where products.cate_id = ${catID}
		group by products.id
		offset ${offset}
		limit ${limit}
	)
	select pr.*,img.data from products pr left join product_images img
	on img.prod_id = pr.id order by avgStar desc`)
    return result;
}

module.exports = {
    getAll,
    getNumberSuggestion,
    getSuggestion
};