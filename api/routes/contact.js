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

//////////
// POST
//////////

// send product request email
router.post('/product', emailController.sendProductRequest);

// send contact email
router.post('/contact', emailController.sendContactRequest);

// ====================
// exports
// ====================
module.exports = router;