'use strict';
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: 'root',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 100,
  waitForConnections:true,
  multipleStatements: false,// Prevent SQL injection risks
});

module.exports = pool;
