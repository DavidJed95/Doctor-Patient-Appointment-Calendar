"use strict";

// const paypal = require("@paypal/checkout-server-sdk");
const {
  ApiError,
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
} = require("@paypal/paypal-server-sdk");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_SECRET_KEY,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);
const paymentsController = new PaymentsController(client);

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
// const createOrder = async (amount, description) => {
const createOrder = async (amount) => {
  const collect = {
    body: {
      intent: "CAPTURE",
      purchaseUnits: [
        {
          amount: {
            currencyCode: "ILS",
            value: amount,
            name: "Appointment"
          },
          // description,
        },
      ],
    },
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } = await ordersController.ordersCreate(
      collect
    );
    console.log(
      `Order created for appointment payment: ${body}, and the status code: ${httpResponse.statusCode}`
    );
    try {
      return {
        jsonResponse: JSON.parse(body),
        httpStatusCode: httpResponse.statusCode,
      }; // body contains approval URL
    } catch (parseError) {
      console.error("Error parsing PayPal response:", body);
      throw new Error("Failed to parse PayPal response");
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
  }
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
// TODO: captureOrder
const capturePayment = async (orderId) => {
  const collect = {
    id: orderId,
    prefer: "return=minimal",
  };
  try {
    const { body, ...httpResponse } = await ordersController.ordersCapture(collect);
    console.log(`Order captures: ${body}, statusCode: ${httpResponse.statusCode}`);
    return {
      jsonResponse: JSON.parse(body),
      httpResponse: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
  }
};

const refundPayment = async (capturedPaymentId) => {
  const collect = { captured_id: capturedPaymentId, prefer: "return=minimal" };
  // request.requestBody({});
  try {
    const { body, statusCode } = await paymentsController.capturesRefund(
      collect
    );

    console.log(`Refund captures: ${body}, statusCode: ${statusCode}`); // Refund details
    return { jsonResponse: JSON.parse(body), httpStatusCode: statusCode }; // Refund details
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
  }
};

module.exports = { createOrder, capturePayment, refundPayment };
