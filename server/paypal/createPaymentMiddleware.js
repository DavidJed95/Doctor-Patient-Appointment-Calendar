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
            total: '10.00', // Total amount for the appointment (replace with actual amount)
            currency: 'USD',
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
    // Continue to the next middleware
    next();
  } catch (error) {
    console.error(error);
    // Handle any error that occurred during payment creation
    res
      .status(500)
      .json({ message: 'An error occurred during payment creation' });
  }
}

module.exports = createPaymentMiddleware;
