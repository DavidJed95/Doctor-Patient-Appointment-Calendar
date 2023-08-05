'use strict';
const doQuery = require('../query')

/**
 * Get a user by their ID.
 * @param {*} id of the user to search
 * @returns user object or null if not found
 */
async function getUserByID(id) {
  const sql = 'SELECT * FROM users WHERE ID = ?';
  const result = await doQuery(sql, [id]);
  console.log(`result in find user by id in database for login result[0]: ${result[0]}`)
  return result.length > 0 ? result[0] : null;
}

module.exports = getUserByID;