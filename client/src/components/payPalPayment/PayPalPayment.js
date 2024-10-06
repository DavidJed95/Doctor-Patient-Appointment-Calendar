import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

/**
 * This component manages the payment of the appointment
 */
const PayPalPayment = ({ amount, description, onSuccess, onFailure }) => {
  /**
   * Creates an order for the appointment
   */
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: description,
          amount: {
            value: amount,
          },
        },
      ],
    });
  };

  /**
   * Captures an order for the appointment
   */
  const onApprove = (data, actions) => {
    return actions.order
      .capture()
      .then((details) => {
        onSuccess(details);
        console.log("Payment successful, and the description is ", description);
      })
      .catch((error) => {
        onFailure(error);
      });
  };

  return (
    <PayPalButtons
      style={{
        shape: "rect",
        layout: "vertical",
        color: "gold",
        label: "paypal",
      }}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onFailure}
    />
  );
};
export default PayPalPayment;
