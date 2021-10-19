const Account = require('../model/account.model');
const asyncHandler = require('express-async-handler');
const jwtHelper = require('../lib/jwt');
const validate = require('../lib/validate');
const uploadfile = require('../lib/image');

/**
 * controller get list account
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getAll = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    if (currentUser.role == 2 || currentUser.role == 3) {
        let result = await Account.getAll(currentUser);
        if (result.length === 0) return res.status(400).send({ message: 'Get failed' });
        return res.status(200).send(result);
    }
    return res.status(422).send({ statusCode: 1, message: "not permission" })
});

/**
 * controller get Account
 * @param {*} req 
 * @param {*} res 
 */

module.exports.getAccount = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    if (currentUser.role == 2 || currentUser.role == 3) {
        const result = await Account.getAccount(req.query);
        if (result.length === 0) {
            return res.status(400).send({ statusCode: 1, message: 'Get failed' });
        }
        return res.status(200).send(result);
    }
    return res.status(422).send({ statusCode: 1, message: "not permission" })
});

/**
 * controller update Role user
 * @param {*} req 
 * @param {*} res 
 */
module.exports.updateRole = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    if (currentUser.role == 2 || currentUser.role == 3) {
        const { error, value } = validate.updateRole(req.body);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body
            })
        } else {
            const result = await Account.updateRole(value);
            if (!result) {
                return res.status(400).send({ statusCode: 1, message: 'update failed' });
            }
            return res.status(200).send({ statusCode: 0, message: "update success" });
        }
    }
    return res.status(422).send({ statusCode: 1, message: "not permission" })
});

module.exports.update = asyncHandler(async function (req, res, next) {
    // {
    //     accId: 9 (optional)
    //     accEmail: “nt11061999@gmail.com” (optional)
    //     accPhoneNumber: ‘0123456789’ (optional)
    //     accFullName: ‘hashirama’ (optional)
    //     }
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }

    var account = {
        email: req.body.accEmail,
        phoneNumber: req.body.accPhoneNumber,
        fullName: req.body.accFullName,
        update_date: new Date()
    }

    const result = await Account.updateAccount(account, req.body.accId);
    if (!result) {
        return res.status(400).send({ statusCode: 1, message: 'update failed' });
    }
    return res.status(200).send({ statusCode: 0, message: "update success" });
});

module.exports.updateStatus = asyncHandler(async function (req, res, next) {
    // {
    //     “accId” : number, (require)
    //     “accStatus”: number (require)
    // }
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }

    try {
        const { error, value } = validate.checkAccountUpdateStatus(req.body);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body
            })
        } else {
            var account = {
                status: req.body.accStatus,
                update_date: new Date()
            }
        
            const result = await Account.updateAccountStatus(account, req.body.accId);
            if (!result) {
                return res.status(400).send({ statusCode: 1, message: 'update failed' });
            }
            return res.status(200).send({ statusCode: 0, message: "update success" });
        }
    } catch (error) {
        res.send({ code: error.code, message: error.message || undefined });
    }
});

/**
 * controller delete user
 * @param {*} req 
 * @param {*} res 
 */
module.exports.deleteAccount = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    if (currentUser.role == 2 || currentUser.role == 3) {
        const id = req.query.id || req.params.id;
        const result = await Account.deleteAccount(id);
        if (!result) {
            return res.status(400).send({ statusCode: 1, message: 'delete failed' });
        }
        return res.status(200).send({ statusCode: 0, message: "delete success" });
    }
    return res.status(422).send({ statusCode: 1, message: "not permission" })
});

/**
 * controller delete user
 * @param {*} req 
 * @param {*} res 
 */
module.exports.updatePassword = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    const {accPassWord, accConfirmPassword } = req.body

	if (accPassWord !== accConfirmPassword) {
		return res.status(400).json({
			errorMessage: 'password is different from confirm password',
			statusCode: 1
		})
	}
    const result = await Account.updatePassword(accPassWord,currentUser.id);

});

module.exports.updateImage = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);

    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }

    const resultImage= await uploadfile.avatarUploader(req.file, currentUser.accId, 'insert', null);
    console.log('log');
    console.log(resultImage)

    return res.json({ image: resultImage });
});