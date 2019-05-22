// ====================
// imports
// ====================
const mongoose = require('mongoose');

// ====================
// models
// ====================
const Product = require('../models/product');

// ====================
// exports
// ====================

exports.serveErrorPage = (req, res, next) => {
	err = req.params.error;

	console.log("getting here");
	res.render('../' + err, {
		title: err,
	});
};