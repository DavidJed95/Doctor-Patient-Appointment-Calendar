'use strict';
const db = require('./database');

/**
 * Execute a single query
 * @param {*} sql sql - SQL query
 * @param {*} param - parameter to pass to the SQL query
 * @returns query result
 */
async function doQuery(sql, param) {
  const result = await db.query(sql, param);
  console.log(`doQuery ${sql} Params ${param}: ${result[0]}`);
  return result[0];
}

module.exports = doQuery;
