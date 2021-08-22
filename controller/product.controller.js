const Product = require('../model/product.model');
const asyncHandler = require('express-async-handler');

/**
 * controller get all Product
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Product.getAll();
    var prodList = []
    var index = 0;

    while (index < result.length) {
        let prodObj = {
            prod_id: result[index].id,
            prod_name: result[index].prod_name,
            prod_category_id: result[index].cate_id,
            prod_amount: result[index].amount,
            prod_created_date: result[index].created_date,
            prod_updated_date: result[index].updated_date,
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
    if (result) {
        return res.status(200).json({
            listProduct: prodList,
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
 * controller get top month Product
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getTopMonth = asyncHandler(async function (req, res, next) {
    let result = await Product.getTopMonth();
    
    var listProduct = [];
    if(result.rows.length > 0) {
        for(var i= 0; i< result.rows.length; i++) {
            const id_cate = result.rows[i].id;
            const images = [];
            images.push(result.rows[i].data);
            for(var j= i+ 1; j< result.rows.length; j++) {
                if(id_cate === result.rows[j].id) {
                    images.push(result.rows[j].data);
                }
            }
            //check exist in listProduct
            var existCategory= false;
            if(listProduct) {
                listProduct.forEach(element => {
                    if(id_cate === element.prod_id) {
                        existCategory = true;
                    }
                });
            }

            if(!existCategory) {
                listProduct.push({
                    prod_id: id_cate,
                    prod_name: result.rows[i].name,
                    prod_category_id: result.rows[i].cate_id,
                    prod_amount: result.rows[i].amount,
                    prod_created_date: result.rows[i].created_date,
                    prod_updated_date: result.rows[i].updated_date,
                    prod_price: result.rows[i].price,
                    image: images
                })
                
            }
        }
    }

    if (result) {
        return res.status(200).json({
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
    let result = await Product.getSuggestion();
    
    var listProduct = [];
    if(result.rows.length > 0) {
        for(var i= 0; i< result.rows.length; i++) {
            const id_cate = result.rows[i].id;
            const images = [];
            images.push(result.rows[i].data);
            for(var j= i+ 1; j< result.rows.length; j++) {
                if(id_cate === result.rows[j].id) {
                    images.push(result.rows[j].data);
                }
            }
            //check exist in listProduct
            var existCategory= false;
            if(listProduct) {
                listProduct.forEach(element => {
                    if(id_cate === element.prod_id) {
                        existCategory = true;
                    }
                });
            }

            if(!existCategory) {
                listProduct.push({
                    prod_id: id_cate,
                    prod_name: result.rows[i].name,
                    prod_category_id: result.rows[i].cate_id,
                    prod_amount: result.rows[i].amount,
                    prod_created_date: result.rows[i].created_date,
                    prod_updated_date: result.rows[i].updated_date,
                    prod_price: result.rows[i].price,
                    image: images
                })
                
            }
        }
    }

    if (result) {
        return res.status(200).json({
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