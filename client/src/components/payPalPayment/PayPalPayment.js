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
    // Order is created on the server and the order id is returned
    // return fetch('/my-server/create-paypal-order', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   // TODO:  use the "body" param to optionally pass additional order information
    //   // like product skus and quantities
    //   body: JSON.stringify({
    //     appointment: {
    //       description: 'Appointment',
    //       cost: '100',
    //     },
    //   }),
    // })
    //   .then(response => response.json())
    //   .then(order => order.id);

    // const payload = {
    //   intent: "CAPTURE",
    //   purchase_units: [
    //     {
    //       amount: {
    //         currency_code: "USD",
    //         value: "110.00",
    //       },
    //     },
    //   ],
    // };
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
    // Order is captured on the server and the response is returned to the browser
    // return fetch('/my-server/capture-paypal-order', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     orderID: data.orderID,
    //   }),
    // }).then(response => response.json());
    return actions.order
      .capture()
      .then((details) => {
        onSuccess(details);
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
