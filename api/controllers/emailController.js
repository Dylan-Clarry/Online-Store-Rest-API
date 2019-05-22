// ====================
// imports
// ====================
const mongoose = require('mongoose');
const nodeMailer = require('nodemailer');

// ====================
// models
// ====================
//const Order = require('../models/order');

// ====================
// exports
// ====================

// send product request
exports.sendProductRequest = (req, res, next) => {

	//product info
	const productName = req.body.productName;
	const productPrice = req.body.productPrice;
	const productDescription = req.body.productDescription;
	const productImagePath = req.body.productImagePath;

	// senders request info
	const name = req.body.name;
	const email = req.body.email;
	const phoneNumber = req.body.phoneNumber;
	const message = req.body.message;

	const HelperOptions = {
		from: name + '<' + process.env.GMAIL_EMAIL + '>',
		to: 'dylan.imail@gmail.com',
		subject: "Item Request: " + productName,
		html: '<img src="cid:productImage" width="250px">'
			+ "<p>Product Name: " + productName +"</p>"
			+ "<p>Product Price: " + productPrice +"</p>"
			+ "<p>Product Description: " + productDescription +"</p>"
			+ "<br>"
			+ "<p>From: " + name + "</p>"
			+ "<p>Return Address: "+ email + "</p>"
			+ "<p>Phone Number: " + phoneNumber + "</p>"
			+ "<br><p>Message: </p>"
			+ "<p>" + message + "</p>",
		attachments: [{
			filename: productName + ".png",
			path: productImagePath,
			cid: 'productImage',
		}],
	};
	sendEmail(HelperOptions);
	res.redirect(302, '/?messageSent=true');
}

// send contact request
exports.sendContactRequest = (req, res, next) => {
	const name = req.body.name;
	const email = req.body.email;
	const subject = req.body.subject;
	const message = req.body.message;

	const HelperOptions = {
		from: name + '<' + process.env.GMAIL_EMAIL + '>',
		to: 'dylan.imail@gmail.com',
		subject: subject,
		html: "<p>From: " + name + "</p>"
			+ "<p>Return Address: "+ email + "</p>"
			+ "<p>Subject: " + subject + "</p>"
			+ "<br><p>Message: </p>"
			+ "<p>" + message + "</p>",
	};
	sendEmail(HelperOptions);
	res.redirect(302, '/contact/?messageSent=true');
};

const sendEmail = (HelperOptions) => {
	const transporter = nodeMailer.createTransport({
		service: "gmail",
		secure: false,
		port: 587,
		auth: {
			user: process.env.GMAIL_EMAIL,
			pass: process.env.GMAIL_PASSWORD,
		},

		tls: {
			rejectUnauthorized: false,
		}
	});

	transporter.sendMail(HelperOptions, (err, info) => {
		if(err) {
			console.log(err);
		}
		console.log("Message sent!");
		console.log(info);
	});
}