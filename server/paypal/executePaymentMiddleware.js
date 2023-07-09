'use strict';
const paypal = require('./paypal');
async function executePaymentMiddleware(req, res, next) {
  const { paymentId, payerId } = req.query;

  try {
    // Execute the PayPal payment
    const executePayment = await new Promise((resolve, reject) => {
      paypal.payment.execute(
        paymentId,
        { payer_id: payerId },
        (error, payment) => {
          if (error) {
            reject(error);
          } else {
            resolve(payment);
          }
        },
      );
    });
    // Attach the executed payment object to the request for later use
    req.executedPayment = executePayment;

    // Continue to the next middleware
    next();
  } catch (error) {
    console.error(error);
    // Handle any error that occurred during payment execution
    res
      .status(500)
      .json({ message: 'An error occurred during payment execution' });
  }
}

module.exports = executePaymentMiddleware;
