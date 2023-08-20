'use strict';
const doQuery = require('../query');

/**
 * Update the profile information of a user.
 * @param {*} id - User ID
 * @param {*} updates - Object containing the updated profile fields
 * @returns { status, message }
 * to DO
 */
async function updateUserProfile(user) {
  const updateFields = [];
//:TODO ID
  // Generate the update query and collect the update fields
  let updateQuery = 'UPDATE users SET ';
  for (const [key, value] of Object.entries(user)) {
    if (key !== 'ID') {
      updateQuery += `${key} = ?, `;
      updateFields.push(value);
    }
  }

  // Remove the trailing comma and space
  updateQuery = updateQuery.slice(0, -2);

  // Add the WHERE clause to update only the specific user
  updateQuery += ' WHERE ID = ?';
  updateFields.push(id);

  // Execute the update query
  await doQuery(updateQuery, updateFields);

  return { status: 'success', message: 'User profile updated successfully' };
}

module.exports = updateUserProfile;
