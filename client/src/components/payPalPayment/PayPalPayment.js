import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { MY_PAYPAL_CLIENT_ID } from "../../config";

/**
 * PayPalPayment component to handle payment for appointments.
 * Integrates with PayPal API to create and capture orders.
 */
const PayPalPayment = ({ amount, description, onSuccess, onFailure }) => {
  const initialOptions = {
    "client-id": MY_PAYPAL_CLIENT_ID,
    currency: "ILS",
    intent: "CAPTURE",
  };
  /**
   * Creates an order for the appointment
   */
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: description,
          amount: { value: amount },
        },
      ],
    });
  };

  /**
   * Captures an order for the appointment
   */
  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      const captureId = details.purchase_units[0].payments.captures[0].id;
      onSuccess({ details, captureId });
      console.log("Payment successful, with capture ID:", captureId);
    } catch (error) {
      onFailure(error);
    }
  };
  const onError = (error) => {
    console.error(`PayPal checkout onError: ${error}`)
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          shape: "rect",
          layout: "vertical",
          color: "gold",
          label: "paypal",
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};
export default PayPalPayment;
