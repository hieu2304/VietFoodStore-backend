const Cart = require('../model/stock.model');
const asyncHandler = require('express-async-handler');
const Product = require('../model/product.model');
const validate = require("../lib/validate");
const jwtHelper = require('../lib/jwt');

module.exports.getList = asyncHandler(async function (req, res, next) {
	const { page, limit } = req.query
	let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
	const listCart = await Cart.findByAcc(currentUser.accId)

	if (listCart.length === 0) {
		return res.status(403).json({
			errorMessage: 'Customer Does Not Have Any Product In Cart'
		})
	}
	const listProduct = await Product.findAll()
	const listProductImages = await Product.findAllImage ()

	let totalPrice = 0
	let totalAmount = 0

	const result = await Promise.all([
		listCart.map((item) => {
			const productInfo = listProduct.find((info) => info.id === item.prod_id)
			const productImage = listProductImages.find((info) => info.prod_id === item.prod_id)
			if (productInfo) {
				totalPrice = totalPrice + item.amount * parseInt(productInfo.price)
				totalAmount = totalAmount + item.amount
				return {
					cartId: item.id,
					prodId: productInfo.id,
					prodName: productInfo.name,
					prodPrice: productInfo.price,
					prodImage: productImage ? productImage.data : '',
					totalPrice: item.amount * parseInt(productInfo.price),
					cartAmount: item.amount,
				}
			}

			return res.status(400).json({
				errorMessage: 'Some Product In Cart Is Invalid'
			})
		})
	])

	if (result) {	
		if (result.length === 0) {
			return res.status(500).json({
				statusCode: 1
			})
		}

		if (page || limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(result[0].length / parseInt(limit))

			if (result[0].length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = result[0].slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				totalAmount,
				totalPrice,
				listCart: paginationResult,
				statusCode: 0
			})
		}

		return res.status(200).json({
			listCart: result[0],
			totalAmount,
			totalPrice,
			statusCode: 0
		})
	}
	
	return res.status(500).json({
		statusCode: 1
	})
})

module.exports.addCart = asyncHandler(async function (req, res, next) {
    const { prodId, cartAmount } = req.body
	let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }

	if (cartAmount < 1) {
		return res.status(400).json({
			errorMessage: `Product's Amount Must Be Bigger Than 0`,
			statusCode: 1
		})
	}

	const productInfo = await Product.findById(prodId)

	if (productInfo.length === 0) {
		return res.status(400).json({
			errorMessage: 'Product Does Not Exist',
			statusCode: 1
		})
	}

	const checkExist = await Cart.findByAccAndProduct(currentUser.accId, prodId)
	const presentDate = new Date()

	if (checkExist.length === 0) {
		const newCart = {
			acc_id: currentUser.accId,
			prod_id: prodId,
			amount: cartAmount,
			status: 1,
			price: productInfo[0].price,
			updated_date: presentDate
		}

		const returnInfo = await Cart.addcart(newCart)

		return res.status(200).json({
			cartId: returnInfo,
			statusCode: 0
		})
	}

	const updateCart = {
		amount: checkExist[0].amount + cartAmount,
		updated_date: presentDate
	}

	const returnInfo = await Cart.updateCart(checkExist[0].id, updateCart)

	return res.status(200).json({
		cartId: returnInfo,
		statusCode: 0
	})
})

module.exports.updateAmount = asyncHandler(async function (req, res, next) {
	const { cartId, cartAmount } = req.body

	const checkExist = await Cart.findById(cartId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: 'This Product In Your Cart Is Invalid',
			statusCode: 1
		})
	}

	if (cartAmount < 0) {
		return res.status(400).json({
			errorMessage: `Product's Amount Can't Be Negative`,
			statusCode: 1
		})
	}

	if (cartAmount === 0) {
		await Cart.deleteCart(cartId)

		return res.status(200).json({
			statusCode: 0
		})
	}

	const newAmount = {
		cart_amount: cartAmount
	}

	const returnInfo = await Cart.updateCart(cartId, newAmount)

	return res.status(200).json({
		cartId: returnInfo,
		statusCode: 0
	})
})

module.exports.checkPrice = asyncHandler(async function (req, res, next) {
	const { listProduct } = req.body

	const allProduct = await Product.findAll()
	
	let totalPrice = 0

	const result = await Promise.all([
		listProduct.map((item) => {
			let price = 0
			const productInfo = allProduct.find((info) => info.id === item.prodId)

			if (productInfo) {
				price = price + (item.cartAmount * parseInt(productInfo.price))
			}

			return {
				price
			}
		})
	])

	result[0].forEach((item) => {
		totalPrice = totalPrice + item.price
	})
	
	return res.status(200).json({
		totalPrice,
		statusCode: 0
	})
})

module.exports.deleteCart = asyncHandler(async function (req, res, next) {
	const { cartId } = req.body

	const checkExist = await Cart.findById(cartId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: 'This Product In Your Cart Is Invalid'
		})
	}

	await Cart.deleteCart(cartId)
	
	return res.status(200).json({
		statusCode: successCode
	})
})
