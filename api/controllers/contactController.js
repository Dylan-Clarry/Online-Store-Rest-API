// ====================
// imports
// ====================
const mongoose = require('mongoose');

// ====================
// models
// ====================
//const Order = require('../models/order');

// ====================
// exports
// ====================

// send email request
exports.sendEmailRequest = (req, res, next) => {
	res.status(200).json({
		message: "200: OK",
	});
};