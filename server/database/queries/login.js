'use strict';
const bcrypt = require('bcrypt');
const getUserByID = require('./get-user-by-id');

/**
 * Login a user.
 * @param {*} id
 * @param {*} password
 * @returns { status, message, user }
 */
async function login(id, password) {
  const user = await getUserByID(id);

  if (!user) {
    return { status: 'failure', message: 'User not found', user: null };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
    return { status: 'success', message: 'Login successful', user: user };
  } else {
    return { status: 'failure', message: 'Invalid password', user: null };
  }
}

module.exports = login;
