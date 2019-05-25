// ====================
// imports
// ====================
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// variables
const app = express();
const url = "mongodb://localhost/maclaughlin_grain_products";

// ====================
// database connection
// ====================
mongoose.connect(
	url,
	{
		useNewUrlParser: true,
	}
);

// use normal promise
mongoose.Promise = global.Promise;

// morgan logging tool (middleware)
app.use(morgan('dev'));
app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// add headers to avoid CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers',
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if(req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods',
			"GET, PUT, POST, PATCH, DELETE",
		);
		return res.status(200).json({});
	}
	next();
});

// ====================
// routes
// ====================
const productsRoute = require('./api/routes/products');
const contactRoute = require('./api/routes/contact');
const usersRoute = require('./api/routes/users');

// Routes which handle requests
app.use('/products', productsRoute);
app.use('/contact', contactRoute);
app.use('/users', usersRoute);

// error handling
app.use((req, res, next) => {
	const error = new Error("404 not found.");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		}
	});
});

// ====================
// exports
// ====================
module.exports = app;

