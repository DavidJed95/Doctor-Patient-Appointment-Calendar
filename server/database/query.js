'use strict';
const db = require('./database');

/**
 * Execute a single query
 * @param {*} sql sql - SQL query
 * @param {*} param - parameter to pass to the SQL query
 * @returns query result | throws error
 */
async function doQuery(sql, param) {
  try {
    const result = await db.query(sql, param);
    return result[0];
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

module.exports = doQuery;
