// import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
// import { MY_PAYPAL_CLIENT_ID } from "../../config";

// /**
//  * PayPalPayment component to handle payment for appointments.
//  * Integrates with PayPal API to create and capture orders.
//  */
// const PayPalPayment = ({
//   amount,
//   description,
//   onPaymentSuccess,
//   onPaymentError,
// }) => {
//   const initialOptions = {
//     "client-id": MY_PAYPAL_CLIENT_ID,
//     currency: "ILS",
//   };

//   /**
//    * Creates an order for the appointment
//    */
//   const createOrder = (data, actions) => {
//     console.log(
//       `started creating order in PayPalPayment.js line 24: ${
//         data ? data : "Something isn't starting in creating the order"
//       }`
//     );
//     return actions.order.create({
//       purchase_units: [
//         {
//           amount: { value: amount },
//           description: description,
//         },
//       ],
//     });
//   };

//   /**
//    * Captures an order for the appointment payment
//    */
//   const onApprove = async (data, actions) => {
//     try {
//       const capture = await actions.order.capture();
//       const captureId =
//         capture.purchase_units[0].payments.captures[0].id;
//       console.log("captureId in PayPalPayment line 46: ", captureId);
//       const captureStatus =
//         capture.purchase_units[0].payments.captures[0].status;
//       if (captureStatus === "COMPLETED") {
//         onPaymentSuccess(captureId); // Pass the captureId to the parent component
//       } else {
//         throw new Error("Capture ID not found in PayPal response.");
//       }
//     } catch (error) {
//       console.error("Error capturing payment:", error);
//       onPaymentError(error);
//     }
//   };

//   return (
//     <PayPalScriptProvider options={initialOptions}>
//       <PayPalButtons
//         style={{
//           shape: "rect",
//           layout: "vertical",
//           color: "gold",
//           label: "paypal",
//         }}
//         createOrder={createOrder}
//         onApprove={onApprove}
//         onError={(error) => {
//           console.error("PayPal Button Error:", error);
//           onPaymentError(error);
//         }}
//       />
//     </PayPalScriptProvider>
//   );
// };
// export default PayPalPayment;
import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { MY_PAYPAL_CLIENT_ID } from "../../config";
import { useDispatch } from "react-redux";
import {
  createOrder,
  capturePaymentAndSaveAppointment,
} from "../../redux/reducers/AppointmentsSlice";

/**
 * PayPalPayment component to handle payment for appointments.
 * Integrates with PayPal API to create and capture orders.
 */
const PayPalPayment = ({
  amount,
  // description,
  appointmentDetails,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const dispatch = useDispatch();
  const initialOptions = {
    "client-id": MY_PAYPAL_CLIENT_ID,
    currency: "ILS",
  };
  console.log(`Amount in PayPalPayment: ${amount} type of amount: ${typeof amount}`);
  console.log(`Appointment Details in PayPalPayment passed from AppointmentManagement.js: AppointmentID ${appointmentDetails.AppointmentID}, Date: ${appointmentDetails.Date}, StartTime: ${appointmentDetails.StartTime}, EndTime: ${appointmentDetails.EndTime}`);
  // console.log(`The amount for ${description} is ${amount} in paypal payment`);
  /**
   * Creates an order for the appointment
   */
  const createOrderHandler = async () => {
    try {
      const response = await dispatch(createOrder({ amount })).unwrap();
      return response.id;
    } catch (error) {
      console.error("Error initiating payment:", error);
      throw new Error(error.message);
    }
  };

  /**
   * Captures an order for the appointment payment
   */
  const onApproveHandler = async (data) => {
    try {
      await dispatch(
        capturePaymentAndSaveAppointment({
          orderId: data.orderID,
          appointmentDetails,
        })
      ).unwrap();
      onPaymentSuccess(); // Notify parent of success
    } catch (error) {
      onPaymentError(error); // Notify parent of failure
    }
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          shape: "rect",
          layout: "vertical",
          color: "gold",
          label: "paypal",
        }}
        createOrder={createOrderHandler}
        onApprove={onApproveHandler}
        onError={onPaymentError}
      />
    </PayPalScriptProvider>
  );
};
export default PayPalPayment;
