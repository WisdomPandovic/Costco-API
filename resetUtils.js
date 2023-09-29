const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
require('dotenv').config({ path: './makefile.env' });

const RESET_SECRET_KEY = process.env.RESET_SECRET_KEY;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
console.log('emailPass:', emailPass);


console.log('RESET_SECRET_KEY:', RESET_SECRET_KEY);
// console.log(process.env)

// Function to generate a reset token
const generateResetToken = (email) => {
  const resetToken = jwt.sign({ email }, RESET_SECRET_KEY, { expiresIn: '100h' });
  return resetToken;
};


// Function to send a reset email
const sendResetEmail = (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: 'smtp.elasticemail.com',
    port: 587,
    // secure: false,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: http://localhost:3000/forgot-password?token=${resetToken}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Function to verify the token
const verifyResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, RESET_SECRET_KEY);
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // Handle token expired error here
      console.error('Token has expired');
      return null;
    }
    // Handle other errors here
    console.error('Failed to authenticate token:', err.message);
    return null;
  }
};

module.exports = { generateResetToken, sendResetEmail };
