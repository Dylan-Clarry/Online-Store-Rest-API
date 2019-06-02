// ====================
// imports
// ====================
const mongoose = require('mongoose');
const fs = require('fs');

// ====================
// models
// ====================
const Product = require('../models/product');

// ====================
// exports
// ====================

// load products and serve onto index page
exports.getAllProducts = (req, res, next) => {
	Product.find()
	.select("name price _id productImage description")
	.exec()
	.then(products => {

		// create response
		const response = {
			count: products.length,
			products: products.map(product => {
				return {
					product: product,
					request: {
						type: 'GET',
						message: "get this product",
						url: process.env.LOCAL_BUCKET + product._id,
					},
				}
			}),
		}

		// status 200 OK
		res.status(200).json({
			response: response,
		});
	})
	.catch(err => {
		
		// status 500 internal server error
		res.status(500).json({
			error: err,
			message: "500: internal server error.",
		});
	});
};

// get one product
exports.getOneProduct = (req, res, next) => {

	// get id from request
	const { _id } = req.body;

	Product.findById(_id)
	.select("name price _id productImage")
	.exec() // true promise
	.then(product => {

		// log product
		console.log("from database: ", product);

		// if a product was returned
		if(product) {
			res.status(200).json({
				product: product,
				request: {
					type: 'GET',
					message: "get all products",
					url: process.env.LOCAL_BUCKET,
				},
			});
		} else {
			res.status(400).json({
				message: "400: no product found with provided product id",
			});
		}
	})
	.catch(err => {
		
		// status 500 internal server error
		res.status(500).json({
			error: err,
			message: "500: internal server error.",
		});
	});
};

// create product
exports.createProduct = (req, res, next) => {
	
	// log image file
	console.log(req.file);

	// create product
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
		productImage: req.file.path,
	});

	// save new product to database
	product.save()
	.then(product => {

		// log product
		console.log(product);

		// product created
		res.status(200).json({
			message: "200 product successfully created",
			product: product,
				request: {
					type: 'GET',
					message: "get all products",
					url: process.env.LOCAL_BUCKET + product._id,
				},
		});
	})
	.catch(err => {
		
		// status 500 internal server error
		res.status(500).json({
			error: err,
			message: "500: internal server error.",
		});
	});
};

// update product
exports.updateProduct = (req, res, next) => {

	// get id from request
	const { _id } = req.body;

	console.log(req.body);
	if(!_id) {
		return res.status(400).json({
			message: "no id was given",
		});
	}

	// update product
	Product.updateMany({ _id: _id }, {
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
	})
	.exec() // true promise
	.then(result => {

		// status 200 OK product updated
		res.status(200).json({
			message: "Product updated",
			request: {
					type: 'GET',
					message: "get this product",
					url: process.env.LOCAL_BUCKET + _id,
			}
		});
	})
	.catch(err => {
		
		// status 500 internal server error
		res.status(500).json({
			error: err,
			message: "500: internal server error.",
		});
	});
};

// update product photo
exports.updateProductPhoto = (req, res, next) => {

	// get id from request
	const { _id } = req.body;

	console.log(req.file);

	// on empty fields
	if(!_id) {
		res.status(400).json({
			message: "no id was given",
		});
	} else if(!req.file) {
		res.status(400).json({
			message: "no image file was given",
		});
	}

	// update product
	Product.update({ _id: req.body._id }, {
		productImage: req.file.path,
	})
	.exec() // true promise
	.then(result => {

		// status 200 OK product image updated
		res.status(200).json({
			message: "Product photo updated",
			request: {
					type: 'GET',
					message: "get this product",
					url: process.env.LOCAL_BUCKET + _id,
			}
		});
	})
	.catch(err => {
		
		// status 500 internal server error
		res.status(500).json({
			error: err,
			message: "500: internal server error.",
		});
	});
};

// delete product
exports.deleteProduct = (req, res, next) => {
	
	// get id from request
	const { _id } = req.body;

	Product.findById(_id)
	.select("productImage")
	.exec() // true promise
	.then(product => {
		
		// delete product image from file system
		deleteProductImage(product.productImage);
	})
	.catch(err => {
		// status 500 internal server error
		res.status(500).json({
			error: err,
			message: "500: internal server error.",
		});
	});

	// delete product
	Product.deleteOne({ _id: _id })
	.exec() // true promise
	.then(product => {
		res.status(200).json({
			message: "Product deleted",
			request: {
				type: 'POST',
				url: process.env.LOCAL_BUCKET,
				body: {
					name: 'String',
					price: 'String',
					description: 'String',
				}
			}
		});
	})
	.catch(err => {
		
		// status 500 internal server error
		res.status(500).json({
			error: err,
			message: "500: internal server error.",
		});
	});
};

////////////////////
// HELPER FUNCTIONS
////////////////////

// deletes product image from uploads folder
const deleteProductImage = path => {

	console.log(path);

	fs.unlink(path, err => {
		if(err) {
			console.log("error deleting product image from static.");
			return
		}
		console.log(path + " removed");
		return
	});
}








