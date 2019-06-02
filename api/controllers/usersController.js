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

// ====================
// exports
// ====================

exports.getUsersList = (req, res, next) => {
	User.find()
	.select("email password")
	.exec()
	.then(users => {

		// create response
		const response = {
			count: users.length,
			users: users.map(user => {
				return {
					user: user,
				}
			}),
		}

		// status 200 OK
		return res.status(200).json({
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

// signup user
exports.signup = (req, res, next) => {
	User.find({
		email: req.body.email,
	})
	.exec()
	.then(user => {
		if(user.length >= 1) {
			return res.status(409).json({
				message: "Email exists",
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
		
						// status 500 internal server error
						res.status(500).json({
							error: err,
							message: "500: internal server error.",
						});
					});
				}
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

// login user
exports.login = (req, res, next) => {
	User.find({ email: req.body.email })
	.exec()
	.then(user => {
		if(user.length < 1) {
			return res.status(401).json({
				message: "Auth failed, email not found",
			});
		}
		console.log(req.body, user[0].password);
		bcrypt.compare(req.body.password, user[0].password, (err, result) => {
			if(err) {
				return res.status(401).json({
					message: "Auth failed",
					auth: '0',
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
				return res.status(200).json({
					message: "Auth successful",
					auth: '1',
					token: token,
				});
			}
			res.status(401).json({
				message: "Auth failed, incorrect password",
				auth: '0',
			});
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

// delete user
exports.delete = (req, res, next) => {
	
	// assign id from req
	const { _id } = req.body;

	// check if id is passed
	if(!_id) {
		res.status(400).json({
			message: "400 id not defined",
		});
	}

	User.remove({
		_id: _id
	})
	.exec()
	.then(result => {
		res.status(200).json({
			message: "User deleted",
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