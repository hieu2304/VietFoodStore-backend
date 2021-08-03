  
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

module.exports.generateToken = function(user) {
	return (accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }));
};
module.exports.decodeToken = function decodeToken(token) {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, user) {
		if (err) {
			return null;
		} else {
			return user;
		}
	});
};