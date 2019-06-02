// ====================
// imports
// ====================
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');




// const multerS3 = require('multer-s3');
// const AWS = require('aws-sdk');
// AWS.config.update({
// 	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// 	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });
// const s3 = new AWS.S3();

// const bucket = process.env.AWS_BUCKET;

// // AWS S3
// const s3Storage = multerS3({
// 	s3: s3,
// 	bucket: bucket,
// 	// set public read permissions
// 	acl: 'public-read',
// 	// auto set content type
// 	contentType: multerS3.AUTO_CONTENT_TYPE,
// 	// set key as original file name
// 	key: function(req, file, cb) {
// 		cb(null, new Date().toISOString() + file.originalname);
// 	},
// });







// variables
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './static/uploads');
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	}
});

// filter file
const fileFilter = (req, file, cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		// accept file
		cb(null, true);
	} else {
		// reject file
		cb(null, false);
	}	
};

// upload file
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5, // 5mb limit
	},
	fileFilter: fileFilter,
});

// ====================
// controller
// ====================
const productController = require('../controllers/productController');

// ====================
// requests
// ====================

//////////
// GET
//////////

// get all products
router.get('/', productController.getAllProducts);

// postman testing: get one product
router.get('/:productId', checkAuth, productController.getOneProduct);

//////////
// POST
//////////

// create new product
router.post('/', checkAuth, upload.single('productImage'), productController.createProduct);

// update product
router.post('/update', checkAuth, productController.updateProduct);

// update product photo
router.post('/updatephoto', checkAuth, upload.single('productImage'), productController.updateProductPhoto);

// delete
router.post('/delete', checkAuth, productController.deleteProduct);

// ====================
// exports
// ====================
module.exports = router;














