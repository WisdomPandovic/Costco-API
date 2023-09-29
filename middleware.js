const jwt = require('jsonwebtoken');
require('dotenv').config();
require('dotenv').config({ path: './makefile.env' });

const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT_SECRET:', JWT_SECRET);

function verifyToken(req, res, next) {
  console.log('Middleware invoked');
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        const expirationTime = new Date(decoded.exp * 1000);
        console.log('Token has expired. Expiration time:', expirationTime);
        return res.status(401).json({ message: 'Token has expired' });
      }
      if (req.path === '/forgot-password') {
        return next(); // Allow access to the "forgot password" route
      }
      console.log(err.message)
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    console.log('Received Token:', token);
    console.log('Decoded Payload:', decoded);

    if (!decoded.id || !decoded.name || !decoded.role || !decoded.email || !decoded.password || !decoded.phoneNumber) {
      console.log('Invalid token payload. Missing required fields.');
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = decoded;
    next();
  });
}

function verifyAdminToken(req, res, next) {
    console.log('Middleware invoked');
    const token = req.headers['authorization'];
  
    if (!token) {
      console.log('No token provided'); // Log here
      return res.status(403).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Failed to authenticate token:', err.message); // Log here
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }
  
      if (decoded.role !== 'admin') {
        console.log('Unauthorized'); // Log here
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      console.log('Decoded token:', decoded);
      console.log('Expiration time:', new Date(decoded.exp * 1000)); // Convert to milliseconds
  
      req.user = decoded;
      next();
    });
  }
  
  
  module.exports = { verifyToken, verifyAdminToken };
