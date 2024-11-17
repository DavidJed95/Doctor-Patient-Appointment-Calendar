'use strict';
const paypal = require('./paypal');

async function executePaymentMiddleware(req, res, next) {
  const { paymentId, payerId } = req.query;

  try {
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

    req.executedPayment = executePayment;
    req.captureId = executePayment.transactions[0].related_resources[0].sale.id;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = executePaymentMiddleware;
