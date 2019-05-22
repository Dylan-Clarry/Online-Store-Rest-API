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

// ====================
// controller
// ====================
const productController = require('../controllers/productController');

// ====================
// requests
// ====================

// GET

// admin page
router.get('/', checkAuth, productController.getAllProductsAdmin);

// postman testing: get one product
router.get('/:productId', checkAuth, productController.getOneProduct);

// POST

// create new product
router.post('/', checkAuth, upload.single('productImage'), productController.createProduct);

// PATCH

// update product
router.post('/update', checkAuth, productController.updateProduct);

// update product photo
router.post('/updatePhoto', checkAuth, upload.single('productImage'), productController.updateProductPhoto);

// DELETE
router.post('/delete', checkAuth, productController.deleteProduct);

// ====================
// exports
// ====================
module.exports = router;


