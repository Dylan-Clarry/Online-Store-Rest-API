// ====================
// imports
// ====================
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ====================
// controller
// ====================
const emailController = require('../controllers/emailController');

// ====================
// requests
// ====================

// POST
router.get('/', (req, res, next) => {
	res.render('contact', {
		title: 'Contact',
	});
});

router.post('/', emailController.sendContactRequest);

// ====================
// exports
// ====================
module.exports = router;