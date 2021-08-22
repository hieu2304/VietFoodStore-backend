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
    var index = 0
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
    const { limit, page, catID } = req.query|| req.params 
	const offset = limit * (page - 1)


	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}

    var numberPage = await Product.getNumberSuggestion(catID);

	numberPage = Number(numberPage.rows[0].count)
	if (numberPage > limit) {
		numberPage = Math.ceil(numberPage / limit)
	}
	else {
		numberPage = 1
	}

    var result = Product.getSuggestion(limit,offset,catID);

	result = result.rows


	//process return list
	var prodList = []

	var index = 0
	while (index < result.length) {
		let prodObj = {
			prod_id: result[index].prod_id,
			prod_name: result[index].prod_name,
			prod_category_id: result[index].prod_category_id,
			prod_amount: result[index].prod_amount,
			prod_description: result[index].prod_description,
			prod_created_date: result[index].prod_created_date,
			prod_updated_date: result[index].prod_updated_date,
			prod_price: result[index].prod_price,
			avgStar: result[index].avgstar
		}
		let imageLink = result[index].prod_img_data
		if (index === 0) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		if (result[index].prod_id !== prodList[prodList.length - 1].prod_id) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		index += 1
	}


	if (result) {
		return res.status(200).json({
			numberOfPage: numberPage,
			listProduct: prodList,
			statusCode: successCode
		})
	}
	else {
		return res.status(200).json({
			listProduct: [],
			statusCode: errorCode
		})
	}

});