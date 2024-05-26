'use strict';
const paypal = require('paypal-rest-sdk');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

// Set up PayPal configuration
paypal.configure({
  mode: 'sandbox', // 'sandbox' or 'live' depending on your environment
  client_id: process.env.Client_ID,
  client_secret: process.env.Secret_Key,
});

module.exports = paypal;
