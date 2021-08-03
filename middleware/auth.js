const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const user = require('../service/user');

module.exports.verifyEmailRequired = asyncHandler(async function(req, res, next) {
	const currentUser = jwtHelper.decodeToken(req.headers['token']);
	if (!currentUser) {
		return res.status(401).send({ message: 'Invalid Token' });
	}

	const result = await userService.checkUserActiveEmailCodeYet(currentUser);
	if (result) return next();
	return res.status(403).send({ message: 'User not verified email yet' });
});