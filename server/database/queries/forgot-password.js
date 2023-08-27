'use strict';
const doQuery = require('../query');
const getUserByID = require('./get-user-by-id');

/**
 * Initiate the password reset process for a user.
 * @param {*} user - information passed from passwordResetController
 * @returns { status, message }
 */
async function forgotPassword(user) {
  userExists = await getUserByID(user.id);
  // Check if the provided ID is an email
  const isEmail = user.email.includes('@');

  if (isEmail && userExists.Email === user.email) {
    return {
      status: 'success',
      message:
        'Password reset initiated. Check your email for further instructions.',
      user: userExists,
    };
  } else {
    return {
      status: failure,
      message: 'User not found',
      user: 'undefined',
    };
  }
}

const SALT_ROUNDS = 10;

/**
 * Hash the password using bcrypt.
 * @param {string} password - The plain-text password to hash.
 * @returns {Promise<string>} - The hashed password.
 */
async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Update the password for a given user.
 * @param {string|number} userId - The ID of the user whose password should be updated.
 * @param {string} newPassword - The new password to set for the user.
 * @returns {Promise<object>} - An object indicating the result of the operation.
 */
async function updateUserPassword(userID, newPassword) {
  try {
    const hashedPassword = await hashPassword(newPassword, 10);

    const passwordUpdateQuery = `UPDATE users SET password = ? WHERE ID = ?`;
    const userParams = [hashedPassword, userID];
    const result = await doQuery(passwordUpdateQuery, userParams);
    if (result.affectedRows > 0) {
      return {
        status: 'success',
        message: 'Password updated successfully',
      };
    } else {
      return { status: 'failure', message: 'Failed to update password' };
    }
  } catch (error) {
    console.error('Error updating password', error);
    return { status: 'error', message: 'Internal server error' };
  }
}
module.exports = { forgotPassword, updateUserPassword };
