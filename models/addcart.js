const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId, ref: 'products', required: true },
  quantity: { type: Number, required: true },
  qty: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  Price: { type: Number, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "users", required: true},
  userName: { type: String, ref: "users", required: true },
  productName: { type: String, required: true },
});

const Cart = mongoose.model('carts', CartSchema);

module.exports = Cart;


