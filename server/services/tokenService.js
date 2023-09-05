'user strict';
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

// Core token generation function to create a JWT based on the user, type, and expiresIn parameters
const generateToken = (user, type, expiresIn) => {
  const token = jwt.sign(
    {
      id: user.id || user.ID,        // User's unique identifier
      email: user.email || user.Email,     // User's email address
      type,      // Type of the token (e.g. session, emailVerification, passwordReset)
    },
    process.env.JWT_SECRET,   // JWT secret to sign the token
    {
      expiresIn,   // Time duration after which the token expires
    },
  );
  return token;  // Return the generated token
};

// Generate a token for user sessions
const generateSessionToken = user => {
  return generateToken(user, "session", '24h'); // Tokens for sessions generally have a longer lifespan, here it's 24 hours
};

// Generate a token for email verifications
const generateEmailVerificationToken = user => {
  return generateToken(user, "emailVerification", '24h');  // You can adjust the expiration as needed
};

// Generate a token specifically for password resets
const generatePasswordResetToken = user => {
  return generateToken(user, "passwordReset", '1h');  // Password reset tokens often have a short lifespan for security
};

// Generate a token for keeping the user logged in
const generateLoginToken = user => {
  return generateToken(user, "login", '3d')
}


/**
 * Function to verify an email verification token
 * @param {*} token - to decode/verify
 * @returns decoded token/ null
 */
const verifyToken = (token, expectedType) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== expectedType)
      throw new Error(`Invalid token type, expected ${expectedType}`);
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    throw new Error('Token verification failed');
  }
};
const verifyEmailVerificationToken = token => {
  return verifyToken(token, 'emailVerification');
};

const verifyPasswordResetToken = token => {
  return verifyToken(token, 'passwordReset');
};

module.exports = {
  generateSessionToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateLoginToken,
  verifyEmailVerificationToken,
  verifyPasswordResetToken,
};