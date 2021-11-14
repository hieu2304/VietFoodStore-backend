const Product = require('../model/product.model');
const asyncHandler = require('express-async-handler');
const moment = require('moment');
/**
 * controller get all Product
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Product.getAll();
    var prodList = []
    var index = 0;
    let { page, limit } = req.body;
    while (index < result.length) {
        let prodObj = {
            prod_id: result[index].id,
            prod_name: result[index].prod_name,
            prod_category_id: result[index].cate_id,
            prod_amount: result[index].amount,
            prod_created_date: moment(result.rows[i].create_date).format('DD/MM/YYYY'),
            prod_updated_date: moment(result.rows[i].update_date).format('DD/MM/YYYY'),
            prod_price: result[index].price
        }
        let imageLink = []
        for (let i = index; i < result.length; i++) {
            index = i + 1
            imageLink.push(result[i].data)

            if ((i >= result.length - 1) || (i != 0 && result[index].id != result[index - 1].id)) {
                break;
            }
        }
        prodObj['images'] = imageLink
        prodList.push(prodObj)
    }
    if (prodList.length > 0) {
        if (page) {
            let startIndex = (parseInt(page) - 1) * parseInt(limit)
            let endIndex = (parseInt(page) * parseInt(limit))
            let totalPage = Math.floor(prodList.length / parseInt(limit))

            if (prodList.length % parseInt(limit) !== 0) {
                totalPage = totalPage + 1
            }

            prodList = prodList.slice(startIndex, endIndex);
            return res.status(200).send({
                numberOfPage: totalPage,
                listProduct: prodList,
                statusCode: 0
            });
        } else {
            return res.status(200).send({
                listProduct: prodList,
                statusCode: 0
            });
        }
    }
    else {
        return res.status(400).json({
            listProduct: [],
            statusCode: 1
        })
    }
});

/**
 * controller get detail Product
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getDetail = asyncHandler(async function (req, res, next) {
    const { id } = req.params
    const result = await Product.getDetail(id);
    var listProductDetail = {
        prod_id: result.id,
        prod_name: result.name,
        prod_category_id: result.cate_id,
        prod_amount: result.amount,
        prod_created_date: result.created_date,
        prod_updated_date: result.updated_date,
        prod_price: result.price,
        prod_description: result.description,
        prod_status: 1,
        prod_img: result.prod_img
    }
    if (result) {
        return res.status(200).json({
            listProductDetail,
            statusCode: 0
        })
    }
    return res.status(400).json({
        listProductDetail: [],
        statusCode: 1
    })
});

/**
 * controller get best sale Product
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getTopMonth = asyncHandler(async function (req, res, next) {
    var { limit, page } = req.body
    if (!limit || !page) {
        limit = 10;
        page = 1;
    }
    const offset = limit * (page - 1)
    let result = await Product.getTopMonth(limit, offset);
    var listProduct = [];
    if (result.rows.length > 0) {
        for (var i = 0; i < result.rows.length; i++) {
            const id_cate = result.rows[i].id;
            const images = [];
            images.push(result.rows[i].data);
            for (var j = i + 1; j < result.rows.length; j++) {
                if (id_cate === result.rows[j].id) {
                    images.push(result.rows[j].data);
                }
            }
            //check exist in listProduct
            var existCategory = false;
            if (listProduct) {
                listProduct.forEach(element => {
                    if (id_cate === element.prod_id) {
                        existCategory = true;
                    }
                });
            }

            if (!existCategory) {
                listProduct.push({
                    prod_id: id_cate,
                    prod_name: result.rows[i].name,
                    prod_category_id: result.rows[i].cate_id,
                    prod_amount: result.rows[i].amount,
                    prod_created_date: moment(result.rows[i].create_date).format('DD/MM/YYYY'),
                    prod_updated_date: moment(result.rows[i].update_date).format('DD/MM/YYYY'),
                    prod_price: result.rows[i].price,
                    image: images
                })

            }
        }
    }
    var numberPage = await Product.totalPageBestSale()
    numberPage = Number(numberPage.rows[0].count)
    if (numberPage > limit) {
        numberPage = Math.ceil(numberPage / limit)
    }
    else {
        numberPage = 1
    }
    if (result) {
        return res.status(200).json({
            numberOfPage: numberPage,
            listProduct: listProduct,
            statusCode: 0
        })
    }
    else {
        return res.status(500).json({
            listProduct: [],
            statusCode: 1
        })
    }
});

module.exports.getSuggestion = asyncHandler(async function (req, res, next) {
    let { page, limit, catID } = req.body;
    const offset = limit * (page - 1)
    let result = await Product.getSuggestion(limit, offset);
    var listProduct = [];
    console.log(result)
    if (result.rows.length > 0) {
        for (var i = 0; i < result.rows.length; i++) {
            const id_cate = result.rows[i].id;
            const images = [];
            images.push(result.rows[i].data);
            for (var j = i + 1; j < result.rows.length; j++) {
                if (id_cate === result.rows[j].id) {
                    images.push(result.rows[j].data);
                }
            }
            var existCategory = false;
            if (listProduct) {
                listProduct.forEach(element => {
                    if (id_cate === element.prod_id) {
                        existCategory = true;
                    }
                });
            }

            if (!existCategory) {
                listProduct.push({
                    prod_id: id_cate,
                    prod_name: result.rows[i].name,
                    prod_category_id: result.rows[i].cate_id,
                    prod_amount: result.rows[i].amount,
                    prod_created_date: moment(result.rows[i].create_date).format('DD/MM/YYYY'),
                    prod_updated_date: moment(result.rows[i].update_date).format('DD/MM/YYYY'),
                    prod_price: result.rows[i].price,
                    image: images
                })

            }
        }
    }
    var numberPage = await Product.totalPageSuggestion(catID);
    numberPage = Number(numberPage.rows[0].count)
    if (numberPage > limit) {
        numberPage = Math.ceil(numberPage / limit)
    }
    else {
        numberPage = 1
    }
    if (listProduct.length > 0) {
        return res.status(200).send({
            numberOfPage: numberPage,
            listProduct,
            statusCode: 0
        });
    }
    else {
        return res.status(400).json({
            listProduct: [],
            statusCode: 1
        })
    }
});

/**
 * controller get list by Cart
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getListByCart = asyncHandler(async function (req, res, next) {
    var { limit, page, catID } = req.body
    if (!limit || !page) {
        limit = 10;
        page = 1;
    }
    const offset = limit * (page - 1)
    let result = await Product.getListByCart(catID, limit, offset);
    var listProduct = [];
    if (result.rows.length > 0) {
        for (var i = 0; i < result.rows.length; i++) {
            const id_cate = result.rows[i].id;
            const images = [];
            images.push(result.rows[i].data);
            for (var j = i + 1; j < result.rows.length; j++) {
                if (id_cate === result.rows[j].id) {
                    images.push(result.rows[j].data);
                }
            }
            //check exist in listProduct
            var existCategory = false;
            if (listProduct) {
                listProduct.forEach(element => {
                    if (id_cate === element.prod_id) {
                        existCategory = true;
                    }
                });
            }

            if (!existCategory) {
                listProduct.push({
                    prod_id: id_cate,
                    prod_name: result.rows[i].name,
                    prod_category_id: result.rows[i].cate_id,
                    prod_amount: result.rows[i].amount,
                    prod_created_date: moment(result.rows[i].create_date).format('DD/MM/YYYY'),
                    prod_updated_date: moment(result.rows[i].update_date).format('DD/MM/YYYY'),
                    prod_price: result.rows[i].price,
                    prod_description:result.rows[i].description,
                    image: images
                })

            }
        }
    }
    var numberPage = await Product.totalPageBestSale(catID)
    numberPage = Number(numberPage.rows[0].count)
    if (numberPage > limit) {
        numberPage = Math.ceil(numberPage / limit)
    }
    else {
        numberPage = 1
    }
    if (result) {
        return res.status(200).json({
            numberOfPage: numberPage,
            listProduct: listProduct,
            statusCode: 0
        })
    }
    else {
        return res.status(500).json({
            listProduct: [],
            statusCode: 1
        })
    }
});

/**
 * controller search Product
 * @param {*} req 
 * @param {*} res 
 */

 module.exports.search = asyncHandler(async function (req, res, next) {
    var { limit, page, sortBy, filter, prodName } = req.body
    if (filter == undefined){
		filter = 'create_date'
		
	}
	if (sortBy == undefined){
		sortBy = 'asc'
	}
    if (!limit || !page) {
        limit = 10;
        page = 1;
    }
    const offset = limit * (page - 1)

    if(filter != 'name' && filter != 'amount' && filter != 'create_date' && filter != 'update_date' && filter != 'price'){
		return res.status(400).json({
			errorMessage: "filter is invalid!",
			statusCode: 1
		})
	}

	
	if(sortBy && sortBy != 'asc' && sortBy != 'desc'){
		return res.status(400).json({
			errorMessage: "sort by is invalid!",
			statusCode: 1
		})
	}
	
    let result = await Product.search(prodName, limit, offset);
    var listProduct = [];
    if (result.rows.length > 0) {
        for (var i = 0; i < result.rows.length; i++) {
            const id_cate = result.rows[i].id;
            const images = [];
            images.push(result.rows[i].data);
            for (var j = i + 1; j < result.rows.length; j++) {
                if (id_cate === result.rows[j].id) {
                    images.push(result.rows[j].data);
                }
            }
            //check exist in listProduct
            var existCategory = false;
            if (listProduct) {
                listProduct.forEach(element => {
                    if (id_cate === element.prod_id) {
                        existCategory = true;
                    }
                });
            }

            if (!existCategory) {
                listProduct.push({
                    prod_id: id_cate,
                    prod_name: result.rows[i].name,
                    prod_category_id: result.rows[i].cate_id,
                    prod_amount: result.rows[i].amount,
                    prod_created_date: moment(result.rows[i].create_date).format('DD/MM/YYYY'),
                    prod_updated_date: moment(result.rows[i].update_date).format('DD/MM/YYYY'),
                    prod_price: result.rows[i].price,
                    prod_description:result.rows[i].description,
                    image: images
                })

            }
        }
    }
    var numberPage = await Product.totalPageSearch(prodName)
    numberPage = Number(numberPage.rows[0].count)
    if (numberPage > limit) {
        numberPage = Math.ceil(numberPage / limit)
    }
    else {
        numberPage = 1
    }
    if(sortBy == 'asc')
		listProduct.sort(function(a,b){return a[filter] - b[filter]})
	else if (sortBy == 'desc')
		listProduct.sort(function(a,b){return b[filter] - a[filter]})
    if (result) {
        return res.status(200).json({
            numberOfPage: numberPage,
            listProduct: listProduct,
            statusCode: 0
        })
    }
    else {
        return res.status(500).json({
            listProduct: [],
            statusCode: 1
        })
    }
});