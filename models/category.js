const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
	title: {type: String, required:true,},
	product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
})

const Category = mongoose.model("categorys",CategorySchema)
module.exports = Category;