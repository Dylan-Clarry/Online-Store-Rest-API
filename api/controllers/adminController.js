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

// get all products
exports.getAllProducts = (req, res, next) => {
	
	// find products
	Product.find()
	.select("name price _id productImage")
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
						url: 'http://localhost:3000/admin/' + product._id,
					},
				}
			}),
		}
		res.status(200).json(response);
	})
	.catch(err => {
		res.status(500).json({
			error: err,
			message: '500: internal server error',
		});
	});
};

// get one product
exports.getOneProduct = (req, res, next) => {

	// get id from request and find it
	const id = req.params.productId;
	Product.findById(id)
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
					url: 'http://localhost:3000/admin/products',
				},
			});
		} else {
			res.status(400).json({
				message: "400: no product found with provided product id",
			});
		}
	})
	.catch(err => {
		res.status(500).json({
			error: err,
			message: '500: internal server error',
		});
	})
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
	.then(result => {

		// log result
		console.log(result);

		// response with request url
		res.status(200).json({
			message: "200: Product created",
			createdProduct: {
				_id: result._id,
				name: result.name,
				price: result.price,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/admin/' + result._id,
				},
			},
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err,
			message: '500: internal server error',
		});
	});
};

// update product
exports.updateProduct = (req, res, next) => {

	// get id from request
	const id = req.params.productId;

	// update options
	const updateOps = {};
	for(const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}

	// update product
	Product.update({ _id: id }, { $set: updateOps })
	.exec() // true promise
	.then(result => {
		res.status(200).json({
			type: 'GET',
			message: "product updated; get this product",
			url: 'http://localhost:3000/admin/' + id,
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err,
			message: '500: internal server error',
		});
	});
};

// delete product
exports.deleteProduct = (req, res, next) => {
	
	// get id from request
	const id = req.params.productId;

	// delete product
	Product.remove({ _id: id })
	.exec() // true promise
	.then(result => {
		res.status(200).json({
			message: "product deleted",
			request: {
				type: 'POST',
				url: 'http://localhost:3000/admin/',
				body: {
					name: 'String',
					price: 'Number',
				},
			},
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err,
			message: '500: internal server error',
		});
	});
};














