const Cart = require('../../models/addcart')
const bcrypt = require('bcryptjs')
const Product=require("../../models/product");

const routes = function(app){
// This route adds a product to the shopping cart. Saves information such as product ID, name, quantity, total price, unit price, user, and user name to the cart.
app.post('/add-to-cart', async (req, res) => {
  const { productId,  productName, quantity, totalPrice, Price, user, userName, qty } = req.body;

  try {
    const cartItem = new Cart({
      productId,
      productName,
      quantity,
      totalPrice,
      Price,
      qty,
      user,
      userName,
    });

    await cartItem.save();

    res.json({ message: 'Item added to cart successfully', cartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// This route retrieves a list of items in the shopping cart.
app.get('/get-cart-items', async (req, res) => {
  try {
    const cartItems = await Cart.find(); 
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// This route remove a specific item from the shopping cart based on the product ID.
app.delete('/remove-from-cart/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const deletedCartItem = await Cart.findOneAndDelete({ productId });

    if (!deletedCartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart successfully', deletedCartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


}

module.exports = routes