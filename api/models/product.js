const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	name: { type: String, required: true },
	price: { type: String, required: true },
	description: { type: String, required: false, default: "", },
	productImage: { type: String, required: true },
});

module.exports = mongoose.model('Product', productSchema);