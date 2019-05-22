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
const productController = require('../controllers/productController');
const emailController = require('../controllers/emailController');

// ====================
// requests
// ====================

// get
router.get('/', productController.getAllProductsIndex);

// POST
router.post('/', emailController.sendProductRequest);

// ====================
// exports
// ====================
module.exports = router;