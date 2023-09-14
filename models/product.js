const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
	name:{type:String,required:true},
	image:{type:String,required:true,unique:false},
	description:{type:String,required:true},
	quantity:{type:String,required:true},
	price:{type:String,required:true},
	category:{type: mongoose.Types.ObjectId, ref: "categorys"},
	user: { type: mongoose.Types.ObjectId, ref: "users" },
	date:{type: Date, default:Date.now}

})

const Product = mongoose.model("products",ProductSchema)
module.exports = Product;