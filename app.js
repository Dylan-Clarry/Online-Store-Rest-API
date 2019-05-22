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

// ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/static/views/pages'))

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
const indexRoute = require('./api/routes/index');
const aboutRoute = require('./api/routes/about');
const contactRoute = require('./api/routes/contact');
const adminRoute = require('./api/routes/admin');
const loginRoute = require('./api/routes/login');
const errorsRoute = require('./api/routes/errors');

// Routes which handle requests
app.use('/', indexRoute);
app.use('/about', aboutRoute);
app.use('/contact', contactRoute);
app.use('/admin', adminRoute);
app.use('/login', loginRoute);
app.use('/errors', errorsRoute);

// error handling
app.use((req, res, next) => {
	const error = new Error("404 not found.");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.render('404', {
		title: '404',
	});
	// res.json({
	// 	error: {
	// 		message: error.message,
	// 	}
	// });
});

// ====================
// exports
// ====================
module.exports = app;

