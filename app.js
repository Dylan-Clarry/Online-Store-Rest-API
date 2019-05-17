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
const url = "mongodb://localhost";

// ejs
app.set('view engine', 'ejs');

// ====================
// database connection
// ====================
mongoose.connect(
	url + '/maclaughlin_grain_products',
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

// shop/index page
app.get('/', (req, res) => {
	res.render(path.join(__dirname + '/static/views/index.ejs'));
	//res.sendFile(path.join(__dirname + '/static/views/index.ejs'));
});

const adminRoute = require('./api/routes/admin');
const contactRoute = require('./api/routes/contact');
const shopRoute = require('./api/routes/shop');

// Routes which handle requests
app.use('/admin', adminRoute);
app.use('/contact', contactRoute);
// app.use('/shop', shopRoute);

// error handling
app.use((req, res, next) => {
	const error = new Error("404 not found");
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

