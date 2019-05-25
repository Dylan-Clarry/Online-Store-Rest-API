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

// load products and serve onto index page
exports.getAllProducts = (req, res, next) => {
	Product.find()
	.select("name price id productImage description")
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
						url: 'http://localhost:3000/products/' + product.id,
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
	const { id } = req.body;

	Product.findById(id)
	.select("name price id productImage")
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
					url: 'http://localhost:3000/products/',
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
		id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
		productImage: req.file.path,
	});

	// save new product to database
	product.save()
	.then(result => {

		// log result
		console.log(result);

		// redirect back to admin page
		res.redirect(302, '/admin');
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
	const { id } = req.body;

	console.log(req.body);
	if(!id) {
		return res.status(400).json({
			message: "no id was given",
		});
	}

	// update product
	Product.updateMany({ _id: id }, {
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
					url: 'http://localhost:3000/products/' + id,
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
	const { id } = req.body;

	console.log(req.file);

	// on empty fields
	if(!id) {
		res.status(400).json({
			message: "no id was given",
		});
	} else if(!req.file) {
		res.status(400).json({
			message: "no image file was given",
		});
	}

	// update product
	Product.update({ id: req.body.id }, {
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
					url: 'http://localhost:3000/products/' + id,
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
	const { id } = req.body;

	// delete product
	Product.deleteOne({ _id: id })
	.exec() // true promise
	.then(result => {
		res.status(200).json({
			message: "Product deleted",
			request: {
				type: 'POST',
				url: 'http://localhost:3000/products/',
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









