const Bill = require('../model/bill.model');
const asyncHandler = require('express-async-handler');
const validate = require("../lib/validate");


/**
 * controller getDetailBill
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getDetails = asyncHandler(async function (req, res, next) {
    try {
        const { error, value } = validate.checkBillDetails(req.body);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body
            })
        } else {
            const result = await Bill.getDetails(value);
            if (result.length === 0) {
                return res.status(404).json({
                    listBillDetail: [],
                    statusCode: 1,
                })
            }
            return res.status(200).json({
                listBillDetail: result,
                statusCode: 0
            })
        }
    } catch (e) {
        res.send({ code: error.code, message: error.message || undefined });
    }
});


/**
 * controller get List Bill for Account
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getBill = asyncHandler(async function (req, res, next) {
    const id = req.query.id || req.params.id || 0;
    const result = await Bill.getList(id)
    if (result.length === 0) {
        return res.status(404).json({
            listBill: [],
            statusCode: 1
        })
    }
    return res.status(200).json({
        listBill: result,
        statusCode: 0
    })
});