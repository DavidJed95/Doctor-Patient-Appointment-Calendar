'use strict';
const doQuery = require('../query');
const getUserByID = require('./get-user-by-id');

/**
 * Update the profile information of a user.
 * @param {*} user - user attributes
 * @returns - status, message, user data
 */
async function updateUserProfile(user) {
  const updateFields = [];

  if (user.Password !== null || user.Password !== '') {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(user.Password, 10);
    user.Password = hashedPassword;
  }

  let updateQuery = 'UPDATE users SET ';
  for (const [key, value] of Object.entries(user)) {
    if (key !== 'ID' && value !== '') {
      updateQuery += `${key} = ?, `;
      updateFields.push(value);
    }
  }

  updateQuery = updateQuery.slice(0, -2);
  updateQuery += ' WHERE ID = ?';
  updateFields.push(user.ID);

  await doQuery(updateQuery, updateFields);
  const updatedUser = await getUserByID(user.ID);
  
  return {
    status: 'success',
    message: 'User profile updated successfully',
    user: updatedUser,
  };
}

module.exports = updateUserProfile;
