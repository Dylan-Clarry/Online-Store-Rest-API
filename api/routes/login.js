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
const userController = require('../controllers/userController');

// ====================
// models
// ====================

// ====================
// requests
// ====================

// get
router.get('/', (req, res, next) => {
	res.render('login', {
		title: "Login",
	});
});

router.post('/', userController.login);

router.post('/signup', checkAuth, userController.signup);

router.delete('/delete', checkAuth, userController.delete);

// ====================
// exports
// ====================
module.exports = router;