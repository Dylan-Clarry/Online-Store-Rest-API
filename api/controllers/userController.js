// ====================
// imports
// ====================
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ====================
// models
// ====================
const User = require('../models/user');

// ====================
// controllers
// ====================
const productController = require('../controllers/productController');

// ====================
// exports
// ====================

// signup user
exports.signup = (req, res, next) => {
	User.find({
		email: req.body.email,
	})
	.exec()
	.then(user => {
		if(user.length >= 1) {
			return res.status(409).json({
				message: "Mail exists",
			});
		} else {
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				if(err) {
					return res.status(500).json({
						error: err,
					});
				} else {
					const user = new User({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						password: hash,
					});
					user.save()
					.then(result => {
						console.log(result);
						res.status(201).json({
							message: "User created",
						});
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({
							error: err,
						});
					});
				}
			});
		}
	})
	.catch();
};

// login user
exports.login = (req, res, next) => {
	User.find({ email: req.body.email })
	.exec()
	.then(user => {
		if(user.length < 1) {
			return res.status(401).json({
				message: "Auth failed",
			});
		}
		console.log(req.body, user[0].password);
		bcrypt.compare(req.body.password, user[0].password, (err, result) => {
			if(err) {
				return res.status(401).json({
					message: "Auth failed",
					error: err,
				});
			}
			if(result) {
				const token = jwt.sign( // create jwt token
					{
						email: user[0].email,
						userId: user[0]._id,
					},
					process.env.JWT_KEY,
					{
						expiresIn: "1h",
					}
				);
				res.cookie('token', token);
				res.redirect(302, '../admin');
				noErr = true;
			}

			// prevent sending new headers after they have already been sent
			if(!noErr) {
				res.status(401).json({
					message: "Auth failed",
				});
			}
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err,
		});
	});
};

// delete user
exports.delete = (req, res, next) => {
	User.remove({
		_id: req.params.userId
	})
	.exec()
	.then(result => {
		res.status(200).json({
			message: "User deleted",
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err,
		});
	});
};








