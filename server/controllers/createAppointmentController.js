'use strict';
const setAppointment = require('../database/queries/all-queries');
const createPaymentMiddleware = require('../paypal/createPaymentMiddleware');
const executePaymentMiddleware = require('../paypal/executePaymentMiddleware');

exports.createAppointment = async (req, res, next) => {
  //  Extract appointment data from request body
  const appointmentData = req.body;

  // Payment creation middleware
  createPaymentMiddleware(req, res, async () => {
    try {
      // Redirect the user to the PayPal payment approval URL
      const approvalUrl = req.payment.links.find(
        link => link.rel === approvalUrl,
      ).href;
      console.log(approvalUrl);
      res.redirect(approvalUrl);
    } catch (error) {
      console.error(error);
      // Handle any error that occurred during payment creation
      res
        .status(500)
        .json({ message: 'An error occurred during payment creation' });
    }
  });

  try {
    // Create the appointment
    const result = await setAppointment(appointmentData);
    if (result.status === 'success') {
      // Appointment created successfully, you can send a response indicating success
      // Note:  this reasons will not be reached if the user is redirected to PayPal for payment
      return res
        .status(200)
        .json({ message: 'Appointment has been created successfully' });
    } else {
      // Appointment creation failed, you can send a response indicating the failure reason
      // Note: This response will not be reached if the user is redirected to PayPal for payment
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
};

exports.executePayment = async (req, res, next) => {
  // Execute payment middleware
  executePaymentMiddleware(req, res, async () => {
    try {
      // Handle the payment status and transaction details
      if (req.executePayment.state === 'approved') {
        // Payment is approved, proceed with the appointment creation logic
        // Note: you can access the appointment data from req.body or req.appointmentData
        const appointmentData = req.appointmentData;

        // Create the appointment
        const result = await setAppointment(appointmentData);

        if (result.status === 'success') {
          // Appointment created successfully
          res.status(200).json({ message: 'Appointment created successfully' });
        } else {
          // Appointment creation failed
          res.status(400).json({ message: result.message });
        }
      } else {
        // Payment is not  approved, handle the failure scenario
        res.status(400).json({ message: 'Payment execution failed' });
      }
    } catch (error) {
      next(error);
    }
  });
};
