const jwt = require('jsonwebtoken');

// function verifyToken(req, res, next) {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, 'dfhjhb68927yuwhb7834382fcg783', (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Failed to authenticate token' });
//     }

//     req.user = decoded;
//     next();
//   });
// }

// function verifyToken(req, res, next) {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, 'dfhjhb68927yuwhb7834382fcg783', (err, decoded) => {
//     if (err) {
//       if (err.name === 'TokenExpiredError') {
//         return res.status(401).json({ message: 'Token has expired' });
//       }
//       return res.status(401).json({ message: 'Failed to authenticate token' });
//     }

//     console.log('Decoded token:', decoded);
//         console.log('Expiration time:', new Date(decoded.exp * 1000)); // Convert to milliseconds

//     req.user = decoded;
//     next();
//   });
// }


// function verifyAdminToken(req, res, next) {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, 'dfhjhb68927yuwhb7834382fcg783', (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Failed to authenticate token' });
//     }

//     if (!decoded.isAdmin) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }

//     req.user = decoded;
//     next();
//   });
// }

// function verifyToken(req, res, next) {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, 'dfhjhb68927yuwhb7834382fcg783', (err, decoded) => {
//     if (err) {
//       if (err.name === 'TokenExpiredError') {
//         const expirationTime = new Date(decoded.exp * 1000);
//         console.log('Token has expired. Expiration time:', expirationTime);
//         return res.status(401).json({ message: 'Token has expired' });
//       }
//       return res.status(401).json({ message: 'Failed to authenticate token' });
//     }

//     if (now < expirationTime) {
//       console.log('Token has not expired');
//     } else {
//       console.log('Token has expired');
//     }


//     req.user = decoded;
//     next();
//   });
// }

// function verifyToken(req, res, next) {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, 'xSybW48dRZmLPYrG8wCBjg6XaQ5Nz9Tf', (err, decoded) => {
//     if (err) {
//       if (err.name === 'TokenExpiredError') {
//         const expirationTime = new Date(decoded.exp * 1000);
//         console.log('Token has expired. Expiration time:', expirationTime);
//         return res.status(401).json({ message: 'Token has expired' });
//       }
//       return res.status(401).json({ message: 'Failed to authenticate token' });
//     }

//     const now = new Date();  // Define 'now' here

//     const expirationTime = new Date(decoded.exp * 1000);

//     if (now < expirationTime) {
//       console.log('Token has not expired');
//     } else {
//       console.log('Token has expired');
//     }

//     console.log('Decoded token:', decoded);

//     req.user = decoded;
//     next();
//   });
// }

function verifyToken(req, res, next) {
  console.log('Middleware invoked');
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'p3A#8WmTbD$9S@yK!qXg*1&r^7z%j@2L', (err, decoded) => {

    if (err) {
      if (err.name === 'TokenExpiredError') {
        const expirationTime = new Date(decoded.exp * 1000);
        console.log('Token has expired. Expiration time:', expirationTime);
        return res.status(401).json({ message: 'Token has expired' });
      }
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    // Log the received token and decoded payload
    console.log('Received Token:', token);
    console.log('Decoded Payload:', decoded);

     // Check the content of the payload
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

  jwt.verify(token, 'p3A#8WmTbD$9S@yK!qXg*1&r^7z%j@2L', (err, decoded) => {
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

