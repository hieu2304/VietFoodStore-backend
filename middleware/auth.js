const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const config = require("../config/index");

module.exports.isAuth = async (req, res, next) => {
	const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
	if (tokenFromClient) {
	  try {
		const decoded = await jwt.verify(tokenFromClient, config.development.auth.tokenSecretKey);
		req.jwtDecoded = decoded;		
		next();
	  } catch (error) {
		return res.status(401).json({
		  message: 'Unauthorized.',
		});
	  }
	} else {
	  return res.status(403).send({
		message: 'No token provided.',
	  });
	}
}
