const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const ENV = require("../config/index")

module.exports.generateToken = function(user,secretSignature,tokenLife) {
	const userData = {
		id:	user.id,
		role: user.role
	}
	const accessToken = jwt.sign(userData, secretSignature, { expiresIn: tokenLife });
	return accessToken;
};

module.exports.decodeToken = function(token,secretKey) {
	return jwt.verify(token, secretKey, function(err, user) {
		if (err) {
			return err;
		} else {
			return user;
		}
	});
};