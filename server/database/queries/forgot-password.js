'use strict';
const doQuery = require('../query');
const getUserByID = require('./get-user-by-id');

/**
 * Initiate the password reset process for a user.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 * @param {*} id - User ID
 * @returns { status, message }
 */
async function forgotPassword(req, res, id) {
  console.log(req.body.params.id);
  console.log('id = ' + id);
  let user;

  // Check if the provided ID is an email
  const isEmail = id.includes('@');

  if (isEmail) {
    // Get the user by Email
    const getUserByEmailQuery = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await doQuery(getUserByEmailQuery, [id]);
    user = rows[0];
  } else {
    // Get the user by ID
    user = await getUserByID(id);
  }

  if (!user) {
    return { status: 'failure', message: 'User not found' };
  }

  return {
    status: 'success',
    message:
      'Password reset initiated. Check your email for further instructions.',
    user: user,
  };
}

module.exports = forgotPassword;
