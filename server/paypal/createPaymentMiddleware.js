'use strict';
const paypal = require('./paypal');

async function createPaymentMiddleware(req, res, next) {
  try {
    // Create a Paypal  payment object
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
            total: '100.00', // TODO: Total amount for the appointment (replace with actual Treatment Price)
            currency: 'ILS',
          },
          description: 'Appointment Payment',
        },
      ],
    };

    // Create the PayPal payment
    const createPayment = await new Promise((resolve, reject) => {
      paypal.payment.create(payment, (error, payment) => {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });
    // Attach the payment object to the request for later use
    req.payment = createPayment;
  } catch (error) {
    next(error);
  }
}

module.exports = createPaymentMiddleware;
