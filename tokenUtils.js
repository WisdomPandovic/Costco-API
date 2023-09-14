const jwt = require('jsonwebtoken');

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


  return jwt.sign(payload, 'p3A#8WmTbD$9S@yK!qXg*1&r^7z%j@2L', options);

}

module.exports = generateToken;
