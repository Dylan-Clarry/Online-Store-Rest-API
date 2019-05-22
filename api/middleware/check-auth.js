// ====================
// imports
// ====================
const jwt = require('jsonwebtoken');
const cp = require('cookie-parser');

// ====================
// exports
// ====================
module.exports = [cp(), (req, res, next) => {
	try {
		const decoded = jwt.verify(req.cookies['token'], process.env.JWT_KEY);
		req.userData = decoded;
		next();
	} catch(error) {
		res.redirect(302, 'login');
		// return res.status(401).json({
		// 	message: "Auth failed",
		// });
	}
}];