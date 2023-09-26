const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	avatar:{type:String,required:false,unique:false},
	name:{type:String,required:true,unique:true},
	email:{type:String,required:true,unique:true},
	password:{type:String,required:true},
	phoneNumber:{type:Number,required:true},
	membershipNumber:{type:Number,required:false},
	isloggedIn:{type:Boolean,default:false},
	role:{type:String,enum:["admin", "user"],default:"user"},
    lastLogin: { type: Date }, 
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
})

const User = mongoose.model("users",UserSchema)
module.exports = User;

