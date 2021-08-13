const Comment = require('../model/comment.model');
const asyncHandler = require('express-async-handler');
const validate = require("../lib/validate");
const jwt = require('jsonwebtoken');

/**
 * controller get List Bill for Account
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getListCommentByProductId = asyncHandler(async function (req, res, next) {
    const productId = req.query.productId || req.params.productId || 0;
    const result = await Comment.getCommentByProductId(productId)
    if(result === null) {
        return res.status(204).json({
            listComment: [],
            statusCode: 1
        });
    }

    return res.status(200).json({
        listComment: result,
        statusCode: 0
    })
});

module.exports.addComment = asyncHandler(async function (req, res, next) {
    try {
        //get info token to get accId
        const tokenFromClient = req.body.token || req.query.token || req.headers["authorization"];
        const {accId} = await jwt.verify(tokenFromClient, process.env.SECRET_KEY);
        const comment = req.body;
        comment.acc_id = accId;
        //validate comment
        const { error, value } = validate.checkAddComment(comment);

        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body,
                statusCode: 1
            })
        } else {
            const result = await Comment.add(comment);
            comment.id = result[0];
            res.json({
                listComment: [comment],
                statusCode: 0
            });
        }
    } catch (e) {
        res.send({ code: error.code, message: error.message || undefined });
    }
});