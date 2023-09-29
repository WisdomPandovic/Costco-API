const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(user) {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role
  };

  const options = {
    expiresIn: '2h' // Adjust as needed
  };

  // const options = { expiresIn: '365d' }; // This will make the token expire after 365 days
  // const options = { expiresIn: null }; // This means the token will not expire


  const signToken = jwt.sign(payload, JWT_SECRET, options);
  console.log(signToken)
  return signToken

}

module.exports = generateToken;
