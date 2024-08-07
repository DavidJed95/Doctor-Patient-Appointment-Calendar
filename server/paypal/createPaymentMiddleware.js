'use strict';
const paypal = require('./paypal');

async function createPaymentMiddleware(req, res, next) {
  try {
    const { amount, description } = req.body;

    const payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: 'http://your-app.com/appointment/success',
        cancel_url: 'http://your-app.com/appointment',
      },
      transactions: [
        {
          amount: {
            total: amount,
            currency: 'ILS',
          },
          description: description,
        },
      ],
    };

    const createPayment = await new Promise((resolve, reject) => {
      paypal.payment.create(payment, (error, payment) => {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });

    req.payment = createPayment;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = createPaymentMiddleware;
