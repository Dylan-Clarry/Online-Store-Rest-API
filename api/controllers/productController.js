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

// serve 500 error page
const serveErr500 = () => {
	res.render('/500', {
		title: '500'
	});
};

// load products and serve onto index page
exports.getAllProductsIndex = (req, res, next) => {
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
						url: 'http://localhost:3000/admin/' + product._id,
					},
				}
			}),
		}

		// load index page
		res.render('index', {
			title: "Shop",
			products: response.products,
			count: response.count,
		});
	})
	.catch(err => {

		// on internal server error
		serveErr500();
	});
};

// load products and serve onto admin page
exports.getAllProductsAdmin = (req, res, next) => {
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
						url: 'http://localhost:3000/admin/' + product._id,
					},
				}
			}),
		}

		// load admin page
		res.render('admin', {
			title: "Admin",
			products: response.products,
			count: response.count,
		});
	})
	.catch(err => {

		// on internal server error
		serveErr500();
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

		// on internal server error
		serveErr500();
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

		// redirect back to admin page
		res.redirect(302, '/admin');
	})
	.catch(err => {
		// on internal server error
		serveErr500();
	});
};

// update product
exports.updateProduct = (req, res, next) => {

	// get id from request
	const id = req.body._id;

	// update product
	Product.updateMany({ _id: req.body._id }, {
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
	})
	.exec() // true promise
	.then(result => {

		// redirect back to admin page
		res.redirect(302, '/admin');
	})
	.catch(err => {
		// on internal server error
		serveErr500();
	});
};

// update product photo
exports.updateProductPhoto = (req, res, next) => {

	// get id from request
	const id = req.body._id;
	console.log(req.file);

	// update product
	Product.update({ _id: req.body._id }, {
		productImage: req.file.path,
	})
	.exec() // true promise
	.then(result => {

		// redirect back to admin page
		res.redirect(302, '/admin');
	})
	.catch(err => {
		// on internal server error
		serveErr500();
	});
};

// delete product
exports.deleteProduct = (req, res, next) => {
	
	// get id from request
	const id = req.body._id;

	// delete product
	Product.deleteOne({ _id: id })
	.exec() // true promise
	.then(result => {
		res.redirect(302, '/admin');
	})
	.catch(err => {
		// on internal server error
		serveErr500();
	});
};