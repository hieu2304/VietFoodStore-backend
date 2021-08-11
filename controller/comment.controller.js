const Comment = require('../model/comment.model');
const asyncHandler = require('express-async-handler');
const validate = require("../lib/validate");


/**
 * controller get List Bill for Account
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getListCommentByProductId = asyncHandler(async function (req, res, next) {
    const productId = req.query.productId || req.params.productId || 0;
    const result = await Comment.getCommentByProductId(productId)
    if(result === null) {
        return res.status(204).end();
    }

    return res.status(200).json({
        result
    })
});