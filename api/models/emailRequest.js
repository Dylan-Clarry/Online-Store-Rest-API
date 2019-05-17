const mongoose = require('mongoose');

const emailRequestSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	senderEmail: {
		type: String,
		required: true,
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
	},
	name: { type: String, required: true  }
	message: { type: String, required: true },
	phoneNumber: { type: String, required: false },
});

module.exports = mongoose.model('emailRequest', emailRequestSchema);