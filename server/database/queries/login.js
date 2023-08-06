'use strict';
const bcrypt = require('bcrypt');
const getUserByID = require('./get-user-by-id');

/**
 * This method logs a user into the system with his/hers credentials
 * @param {*} user - user credentials as id and password he registered with
 * @returns A status code for success/failure logging in, informative message, user information for greeting
 */
async function login(user) {
  const { id, password } = user;
  console.log(`password from login controller in database:  ${password}`);
  const foundUser = await getUserByID(id);
  console.log(`user id: ${id}`);
  console.log(`user attributes: ${foundUser}`);

  if (!foundUser) {
    return { status: 'failure', message: 'User not found', user: null };
  }

  const passwordMatch = await bcrypt.compare(password, foundUser[0].Password);
  console.log(passwordMatch);
  console.table(foundUser[0]);
  if (passwordMatch) {
    return { status: 'success', message: 'Login successful', user: foundUser };
  } else {
    return { status: 'failure', message: 'Invalid password', user: null };
  }
}

module.exports = login;
