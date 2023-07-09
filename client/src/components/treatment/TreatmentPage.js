import React from 'react';
import PayPalButton from './PayPalButton';

const TreatmentPage = ({ treatment }) => {
  const handlePaymentSuccess = paymentResult => {
    // Handle successful payment
    console.log('Payment successful:', paymentResult);
    // Proceed with setting the appointment
    // You can call the relevant function to set the appointment here
  };

  const handlePaymentCancel = () => {
    // Handle payment cancellation
    console.log('Payment cancelled');
    // Show an error message or take appropriate action
  };

  return (
    <div>
      <h1>Treatment Details</h1>
      <p>Treatment Name: {treatment.name}</p>
      <p>Treatment Price: {treatment.price}</p>
      <PayPalButton
        amount={treatment.price}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    </div>
  );
};

export default TreatmentPage;
