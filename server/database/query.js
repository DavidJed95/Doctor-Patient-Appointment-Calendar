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
    console.log(`doQuery ${sql} Params ${param}: ${result[0]}`);
    return result[0];
  } catch (error) {
    console.error(`Database query failed: ${error}`);
    throw new Error(`Database query failed: ${error.message}`);
  }
}

module.exports = doQuery;
