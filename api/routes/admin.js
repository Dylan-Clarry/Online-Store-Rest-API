// ====================
// imports
// ====================
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

// variables
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './static/uploads');
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		// accept file
		cb(null, true);
	} else {
		// reject file
		cb(null, false);
	}	
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5, // 5mb limit
	},
	fileFilter: fileFilter,
});

// ====================
// models
// ====================
//const Order = require('../models/order');

// ====================
// controller
// ====================
const adminController = require('../controllers/adminController');

// ====================
// requests
// ====================

// GET
router.get('/products', adminController.getAllProducts);
router.get('/:productId', adminController.getOneProduct);

// POST
router.post('/', upload.single('productImage'), adminController.createProduct);

// PATCH
router.patch('/:productId', adminController.updateProduct);

// DELETE
router.delete('/:productId', adminController.deleteProduct);

// ====================
// exports
// ====================
module.exports = router;


