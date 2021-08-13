const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

module.exports.generateToken = function(user,secretSignature,tokenLife) {
	const accessToken = jwt.sign(user, secretSignature, { expiresIn: tokenLife });
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