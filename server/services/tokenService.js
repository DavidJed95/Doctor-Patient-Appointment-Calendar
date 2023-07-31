const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

/**
 * Function to generate an email verification token
 * @param {*} user
 * @returns the token generated
 */
const generateEmailVerificationToken = user => {
  const { id, email } = user;
  const token = jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d', // Token expiration time 1 day
    },
  );

  return token;
};

/**
 * Function to verify an email verification token
 * @param {*} token 
 * @returns decoded token/ null
 */
const verifyEmailVerificationToken = token => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log.error(`Token verification failed: ${error}`);
    return null;
  }
};

module.exports = {
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
};
