'use strict';
const setAppointment = require('../database/queries/all-queries');
const createPaymentMiddleware = require('../paypal/createPaymentMiddleware');
const executePaymentMiddleware = require('../paypal/executePaymentMiddleware');

exports.createAppointment = async (req, res, next) => {
  const appointmentData = req.body;

  // Start the payment process
  createPaymentMiddleware(req, res, async () => {
    try {
      const approvalUrl = req.payment.links.find(
        link => link.rel === 'approval_url',
      ).href;
      res.json({ approvalUrl });
    } catch (error) {
      next(error);
    }
  });
};

exports.executePayment = async (req, res, next) => {
  executePaymentMiddleware(req, res, async () => {
    try {
      if (req.executedPayment.state === 'approved') {
        const appointmentData = req.body;
        const result = await setAppointment(appointmentData, true);

        if (result.status === 'success') {
          res.status(200).json({ message: 'Appointment created successfully' });
        } else {
          res.status(400).json({ message: result.message });
        }
      } else {
        res.status(400).json({ message: 'Payment execution failed. Please try again' });
      }
    } catch (error) {
      next(error);
    }
  });
};
