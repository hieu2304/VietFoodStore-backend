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
    const productId = req.body.productID || 0;
    
    //get comments
    const result = await Comment.getCommentByProductId(productId);

    //get info review
    var numberOfUserComment = null;
    const resultNumberOfUserComment = await Comment.getNumberOfUserComment(productId);
    if(resultNumberOfUserComment == undefined)
        numberOfUserComment = null;
    else 
        numberOfUserComment = resultNumberOfUserComment.numberofusercomment;
    const numberOfComment = result.length;
    const avgStar = await Comment.getAvgStar(productId)

    const numberOneStar = await Comment.countNumberStar(productId, 1);

    const numberTwoStars = await Comment.countNumberStar(productId, 2);
    const numberThreeStars = await Comment.countNumberStar(productId, 3);
    const numberFourStars = await Comment.countNumberStar(productId, 4);
    const numberFiveStars = await Comment.countNumberStar(productId, 5);

    let { page, limit } = req.query;
    let commentList = [];
    

    if (page || limit) {
        let startIndex = (parseInt(page) - 1) * parseInt(limit)
        let endIndex = (parseInt(page) * parseInt(limit))
        let numberOfPage = Math.floor(result.length / parseInt(limit))

        if (result.length % parseInt(limit) !== 0) {
            numberOfPage = numberOfPage + 1
        }

        commentList = result.slice(startIndex, endIndex);
        return res.status(200).send({
            listComment: {
                numberOfPage,
                commentList,
                numberOfUserComment: numberOfUserComment,
                numberOfComment,
                avgStar: avgStar.round == null ? 0: avgStar.round,
                numberOneStar: numberOneStar.count,
                numberTwoStars: numberTwoStars.count,
                numberThreeStars: numberThreeStars.count,
                numberFourStars: numberFourStars.count,
                numberFiveStars: numberFiveStars.count,
            },
            statusCode: 0
        });
    }

    return res.status(200).send({
        listComment: {
            numberOfPage: result.length,
            commentList: result,
            numberOfUserComment: numberOfUserComment,
            numberOfComment,
            avgStar: avgStar.round == null ? 0: avgStar.round,
            numberOneStar: numberOneStar.count,
            numberTwoStars: numberTwoStars.count,
            numberThreeStars: numberThreeStars.count,
            numberFourStars: numberFourStars.count,
            numberFiveStars: numberFiveStars.count
        },
        statusCode: 0,
        
    });
});

module.exports.addComment = asyncHandler(async function (req, res, next) {
    try {
        let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
        if (!currentUser) {
            return res.status(401).send({ message: 'Invalid Token' });
        }
        const commentBody = req.body;
        let comment = {
            acc_id: currentUser.accId,
            prod_id: commentBody.productID,
            content: commentBody.content,
            vote: commentBody.vote
        }; 

        var { error, value } = validate.checkAddComment(comment);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body,
                statusCode: 1
            })
        } else {
            await Comment.add(comment);
            res.json({
                message: 'Create Comment success',
                statusCode: 0
            });
        }
    } catch (error) {
        return res.status(404).json({
            message: error,
            statusCode: 1
        })
    }
    res.json({
        message: 'Comment create success',
        statusCode: 0
    })
});

module.exports.updateComment = asyncHandler(async function (req, res, next) {
    try {
        let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
        if (!currentUser) {
            return res.status(401).send({ message: 'Invalid Token' });
        }
        const commentBody = req.body;

        let updComment = {
            id: commentBody.commentID,
            content: commentBody.content,
            vote: commentBody.vote,
            acc_id: currentUser.accId
        }

        var { error, value } = validate.checkUpdateComment(commentBody);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body,
                statusCode: 1
            })
        } else {
            let commentId = updComment.id;
            delete updComment.id;

            await Comment.update(commentId, updComment);
            res.json({
                message: 'Comment Update success',
                statusCode: 0
            });
        }
    } catch (error) {
        return res.status(404).json({
            message: error,
            statusCode: 1
        })
    }
    res.json({
        message: 'Comment Update success',
        statusCode: 0
    })
});

module.exports.deleteComment = asyncHandler(async function (req, res, next) {    
    try {
        let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
        if (!currentUser) {
            return res.status(401).send({ message: 'Invalid Token' });
        }
        const id = req.body.commentID || 0;

        await Comment.deleteComment(id);
        res.json({
            message: 'Comment delete success',
            statusCode: 0
        });
    } catch (error) {
        return res.status(404).json({
            message: error,
            statusCode: 1
        })
    }
    res.json({
        message: 'Comment delete success',
        statusCode: 0
    })
});