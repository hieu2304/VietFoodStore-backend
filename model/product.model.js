const knex = require('../util/knex');
const _ = require('lodash');
const imageService = require('../lib/image');

async function getAll() {
    const data = await knex.from('products')
        .join('product_images', 'products.id', '=', 'product_images.prod_id')
    return data;
}

async function getTopMonth(limit, offset) {
    var result = await knex.raw(`with productSale as(
		select sum(bde.quantity) ,pro.* from (products pro 
		join bill_details bde on pro.id = bde.prod_id)
		group by pro.id, quantity
		order by quantity desc
		limit ${limit}
		offset ${offset}
	)
	select distinct pr.*,img.data from productSale pr left join product_images img
	on img.prod_id = pr.id`)
    return result;
}
async function totalPageSuggestion(catId) {
    const data = await knex.raw(`select count(distinct products.id) 
	from products join comments on products.id = comments.prod_id
	where products.cate_id = ${catId}`)
    return data;
}
async function totalPageBestSale() {
    const data = await knex.raw('select count(DISTINCT prod_id) from bill_details')
    return data;
}
async function totalPageSearch(prodName) {
    const data = await knex.raw(`SELECT count(id)
	FROM products
	WHERE name like '%${prodName}'`)
    return data
}
async function totalPageByCart(catID) {
    const data = await knex.raw(`select count(distinct products.id) from products 
	where products.cate_id = ${catID}`);
    return data;
}
async function getListByCart(catID, limit, offset) {
    const result = await knex.raw(`with product as (
		SELECT * 
        FROM products
		WHERE cate_id = ${catID} 
		limit ${limit}
        offset ${offset}
	)
	select pr.*,img.data from product pr left join product_images img
	on img.prod_id = pr.id`)
    return result;
}

async function getSuggestion(limit, offset) {
    const data = await knex.raw(`
    select d.id, d.name, d.cate_id, d.price, e."data", d.amount, d.avg_vote 
    from (
        select a.id,  a."name", a.cate_id, a.price, a.amount, avg(b.star) avg_vote
        from products a, COMMENTS b
        where a.id= b.prod_id
        group by a.id,  a."name", a.cate_id, a.price, a.amount) d, 
        product_images e
    where d.id= e.prod_id
    order by d.avg_vote DESC
    limit ${limit}
    offset ${offset}`);
    return data;
}
async function search(prodName, limit, offset) {
    const data = await knex.raw(`with product as (
		SELECT *
		FROM products
		WHERE name like '%${prodName}%'
		limit ${limit}
		offset ${offset}
	)
	select pr.*,img.data from product pr left join product_images img
	on img.prod_id = pr.id`)
    return data;
}

async function getDetail(id) {
    var prodObject = {}
    const data = await knex.from('products')
        .where('id', id)
        .returning('*')
        .then(async (rows) => {
            prodObject = rows[0];
            var imageResult = await knex.from('product_images')
                .where('prod_id', prodObject.id);
            prodObject['prod_img'] = imageResult.map(attr => attr.data);
        })
    return prodObject;
}
const findAll = async () => {
	const info = await knex('products')
	return info
}

const findAllImage = async () => {
    const info = await knex('product_images')
    return info
}
const findById = async (prodId) => {
	const info = await knex('products').where({ id: prodId })
	return info
}
const findway = async (prodName,prodCategoryID) => {
    const info = await knex('products')
		.where('name', prodName)
		.andWhere('cate_id', prodCategoryID)
    return info
}

const addway = async (prodName,prodCategoryID,prodAmount,prodPrice,prodDescription,images) => {
    await knex('products').insert({
		name: prodName,
		cate_id: prodCategoryID,
		amount: prodAmount,
		price: prodPrice,
		description: typeof prodDescription !== 'undefined' ? prodDescription : '',
		create_date: moment().format('YYYY-MM-DD HH:mm:ss')
	})
		.returning('*')
		.then(async (rows) => {
			if (images != null) {
				if (images.length === undefined) {// number of uploaded image is 1
					await imageService.productUploader(images, rows[0].id, 'insert')
				}
				else {
					for (let i = 0; i < images.length; i++) {
						await imageService.productUploader(images[i], rows[0].id, 'insert')
					}
				}
			}
		})
}
module.exports = {
    getAll,
    addway,
    findById,
    findway,
    findAllImage,
    getDetail,
    findAll,
    getTopMonth,
    getSuggestion,
    totalPageSuggestion,
    search,
    totalPageBestSale,
    getListByCart,
    totalPageByCart,
    totalPageSearch,
};