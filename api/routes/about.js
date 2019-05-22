// ====================
// imports
// ====================
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

// ====================
// controller
// ====================

// ====================
// requests
// ====================

// get
router.get('/', (req, res, next) => {
	res.render('about', {
		title: 'About',
	});
});

// ====================
// exports
// ====================
module.exports = router;