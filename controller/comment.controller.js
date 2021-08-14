const Comment = require('../model/comment.model');
const asyncHandler = require('express-async-handler');
const validate = require("../lib/validate");
const jwtHelper = require('../lib/jwt');

/**
 * controller get List comment for Product
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getListCommentByProductId = asyncHandler(async function (req, res, next) {
    const productId = req.query.productId || req.params.productId || 0;
    const result = await Comment.getCommentByProductId(productId)
    if (result === null) {
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
        let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
        if (!currentUser) {
            return res.status(401).send({ message: 'Invalid Token' });
        }
        const comment = req.body;
        comment.acc_id = accId;
        const { error, value } = validate.checkAddComment(comment);

        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body,
                statusCode: 1
            })
        } else {
           await Comment.add(value);
            res.json({
                message: 'Comment success',
                statusCode: 0
            });
        }
    } catch (e) {
        res.send({ code: error.code, message: error.message || undefined });
    }
});