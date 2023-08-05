'use strict';
const bcrypt = require('bcrypt');
const getUserByID = require('./get-user-by-id');

/**
 * Login a user.
 * @param {*} id
 * @param {*} password
 * @returns { status, message, user }
 */
async function login(user) {
  const {id, password} = user
  console.log(`password from login controller in database:  ${password}`)
  const foundUser = await getUserByID(id);
  console.log(`user attributes: ${foundUser}`)

  if (!user) {
    return { status: 'failure', message: 'User not found', user: null };
  }

  const passwordMatch = await bcrypt.compare(password, foundUser[0].Password);
  if (passwordMatch) {
    return { status: 'success', message: 'Login successful', user: foundUser };
  } else {
    return { status: 'failure', message: 'Invalid password', user: null };
  }
}

module.exports = login;
