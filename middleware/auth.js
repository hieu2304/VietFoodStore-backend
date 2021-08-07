const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

module.exports.isAuth = async (req, res, next) => {
	const tokenFromClient = req.body.token || req.query.token || req.headers["authorization"];
	if (tokenFromClient) {
	  try {
		const decoded = await jwt.verify(tokenFromClient, process.env.SECRET_KEY);
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
