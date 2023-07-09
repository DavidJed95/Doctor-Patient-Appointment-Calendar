import React, { useEffect } from 'react';

const PayPalButton = ({ amount, onSuccess, onCancel }) => {
  useEffect(() => {
    // Load the PayPal JavaScript SDK
    const loadPayPalScript = async () => {
      const { paypal } = await import('@paypal/paypal-js');

      // Initialize the PayPal SDK with your client ID
      const paypalSDK = await paypal.init({
        client_id: process.env.Client_ID,
        currency: 'ILS',
      });

      // Render the PayPal button
      paypalSDK
        .Buttons({
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                    currency_code: 'ILS',
                  },
                },
              ],
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (paymentResult) {
              onSuccess(paymentResult);
            });
          },
          onCancel: function (data) {
            onCancel();
          },
        })
        .render('#paypal-button-container');
    };

    loadPayPalScript();
  }, [amount, onSuccess, onCancel]);

  return <div id='paypal-button-container'></div>;
};

export default PayPalButton;
