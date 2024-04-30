'use strict';
const bcrypt = require('bcrypt');
const getUserByID = require('./get-user-by-id');

/**
 * This method logs a user into the system with his/hers credentials
 * @param {*} user - user credentials as id and password he registered with
 * @returns A status code for success/failure logging in, informative message, user information for greeting
 */
async function login(user) {
  try {
  const { id, password } = user;
  const foundUser = await getUserByID(id);

  console.log('foundUser:', foundUser); // Add this line to check the content of foundUser
  console.log('Password property:', foundUser.Password); // Add this line to check the Password property
  if (!foundUser || foundUser.length === 0) {
    return { status: 'failure', message: 'User not found', user: null };
  }

  const passwordMatch = await bcrypt.compare(password, foundUser.Password);
  console.log('Password match:', passwordMatch); // Add this line to check the output of bcrypt.compare
  if (passwordMatch) {
    return { status: 'success', message: 'Login successful', user: foundUser };
  } else {
    return { status: 'failure', message: 'Invalid password', user: null };
  }
}
catch (error) {
  return {message: 'Connection failed: Database disconnected/ network unstable'}
}
}

module.exports = login;
