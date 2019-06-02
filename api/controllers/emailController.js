// ====================
// imports
// ====================
const mongoose = require('mongoose');
const nodeMailer = require('nodemailer');

// ====================
// models
// ====================
const Product = require('../models/product');

// ====================
// exports
// ====================

// send product request
exports.sendProductRequest = (req, res, next) => {

	console.log("email: " + process.env.MG_RECEIVEREMAIL);
	
	// senders request info from req
	const { _id, name, email, phoneNumber, message } = req.body;

	// get id from request and find it
	Product.findById(_id)
	.select("name price description productImage")
	.exec() // true promise
	.then(product => {

		// log product
		console.log("from database: ", product);

		// if a product was returned
		if(product) {
			
			// create email
			const emailMarkup = {
				from: name + '<' + process.env.GMAIL_EMAIL + '>',
				subject: "Item Request: " + product.name,
				to: process.env.MG_RECEIVEREMAIL,
				html: 
					`
					<img src="cid:productImage" width="250px">
					<p>Product Name: ${product.name}</p>
					<p>Product Price: ${product.price}</p>
					<p>Product Description: ${product.description}</p>
					<br />
					<p>From: ${name}</p>
					<p>Return Address: ${email}</p>
					<p>Phone Number: ${phoneNumber}</p>
					<br>
					<p>Message: </p>
					<p>${message}</p>
					`,
				attachments: [{
					filename: product.name + ".png",
					path: product.productImage,
					cid: 'productImage',
				}],
			};

			// send constructed email
			sendEmail(emailMarkup);

			// status 200 OK email sent
			return res.status(200).json({
				message: "Email sent successfully!",
				email: emailMarkup,
			});
		} else {

			// error 400 product not found
			res.status(400).json({
				message: "400: no product found with provided product id, unable to send email request",
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
}

// send contact request
exports.sendContactRequest = (req, res, next) => {

	// get email components from req
	const { name, email, subject, message } = req.body;
	console.log(req.body);
	console.log(name, email, subject, message);

	// construct email
	const emailMarkup = {
		from: name + '<' + process.env.GMAIL_EMAIL + '>',
		to: process.env.MG_RECEIVEREMAIL,
		subject: subject,
		html:
			`
			<p>From: ${name}</p>
			<p>Return Address: ${email}</p>
			<p>Subject: ${subject}</p>
			<br>
			<p>Message: </p>
			<p>${message}</p>
			`
	};
	try {

		// send email
		console.log(emailMarkup);
		sendEmail(emailMarkup);
		return res.status(200).json({
			message: "Email sent successfully!",
			email: emailMarkup,
		});
	} catch(err) {
		res.status(500).json({
			error: err,
			message: "500: internal server error."
		});
	};
};

// send email functions
const sendEmail = emailMarkup => {
	const transporter = nodeMailer.createTransport({
		service: "gmail",
		secure: false,
		port: 25,
		auth: {
			user: process.env.GMAIL_EMAIL,
			pass: process.env.GMAIL_PASSWORD,
		},

		tls: {
			rejectUnauthorized: false,
		}
	});

	transporter.sendMail(emailMarkup, (err, info) => {
		if(err) {
			console.log(err);
		}
		console.log("Message sent!");
		console.log(info);
		// res.status(200).json({
		// 	message: "Email sent successfully!",
		// 	email: emailMarkup,
		// });
	});
}

const getProduct = id => {

	// get id from request and find it
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