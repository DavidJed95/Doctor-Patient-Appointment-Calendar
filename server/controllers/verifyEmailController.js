'use strict';

const doQuery = require('../database/query');
const tokenService = require('../services/tokenService');
/**
 * This method decodes the received token and checks if it is the same that the user got
 * @param {*} req - request of the user
 * @param {*} res - response back to the user
 * @returns status code of success/ failure of decoding the verification email, message and redirection path
 */
const verifyEmail = async (req, res) => {
  const emailVerificationToken = req.params.token;
  console.log('Token received: ', emailVerificationToken);
  try {
    const decodedToken = tokenService.verifyEmailVerificationToken(
      emailVerificationToken,
    );
    console.log(decodedToken);
    if (decodedToken) {
      const userId = decodedToken.id;
      console.log(decodedToken);
      console.log(typeof decodedToken.id);

      // Update user's isUserVerified status to 1 in the database
      const updateUserSql = `UPDATE users SET isUserVerified = ? WHERE ID = ?`;
      await doQuery(updateUserSql, [1, userId]);

      return res.status(200).json({
        message: 'Registration email has been verified',
        redirectTo: '/',
      });
    } else {
      console.log('Invalid token: ', decodedToken);
      return res
        .status(400)
        .json({ message: 'Invalid token or expired link.' });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'An error occurred during email verification.' });
  }
};

module.exports = verifyEmail;
