import React from 'react';
import PayPalButton from './PayPalButton';
const PayPalPayment = ({
  amount,
  handlePaymentSuccess,
  handlePaymentError,
}) => {
  const onApprove = async (data, actions) => {
    try {
      const paymentResult = await actions.order.capture();
      const response = await handlePaymentSuccess(paymentResult);

      if (response.status === 'success') {
        // Display success message to the user
        console.log('Payment successful:', response.message);
      } else {
        // Display failure message to the user
        console.error('Payment failed:', response.message);
      }
    } catch (error) {
      // Handle any errors that occur during payment capture
      console.error('Payment capture failed:', error);
      handlePaymentError();
    }
  };

  return (
    <div>
      <h3>Pay with PayPal</h3>
      <p>Amount: ${amount}</p>
      <PayPalButton
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
              },
            ],
          });
        }}
        onApprove={onApprove}
      />
    </div>
  );
};

export default PayPalPayment;
