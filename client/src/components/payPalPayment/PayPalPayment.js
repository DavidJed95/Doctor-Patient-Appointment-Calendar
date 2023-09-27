import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';

export const PayPalPayment = ({ amount, onSuccess, onFailure }) => {
  const createOrder = data => {
    // Order is created on the server and the order id is returned
    return fetch('/my-server/create-paypal-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // use the "body" param to optionally pass additional order information
      // like product skus and quantities
      body: JSON.stringify({
        appointment: {
          description: 'Appointment',
          cost: '100',
        },
      }),
    })
      .then(response => response.json())
      .then(order => order.id);
  };
  const onApprove = data => {
    // Order is captured on the server and the response is returned to the browser
    return fetch('/my-server/capture-paypal-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    }).then(response => response.json());
  };
  return (
    <PayPalButtons
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
    />
  );
};
