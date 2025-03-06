import { BASE_URL } from "../../config";

/// Initiate PayPal payment and create appointment
export const createOrderAPI = async (amount) => {
  console.log(
    `Making a paypal order with amount: ${amount} amount of type ${typeof amount}`
  );
  const response = await fetch(`${BASE_URL}/appointment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(amount),
  });
  if (!response.ok) {
    console.log(
      `Error on making an paypal order, response.message: ${response.message}, and response.approvalUrl`
    );
    throw new Error("Error initiating payment.");
  }
  console.log(
    `Sending payment request with amount: ${JSON.stringify({ amount })}`
  );
  return response.json(); // Expecting { message, approvalUrl }
};

export const capturePaymentAndSaveAppointmentAPI = async (
  orderId,
  appointmentDetails
) => {
  const response = await fetch(`${BASE_URL}/appointment/capture-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, appointmentDetails }),
  });
  if (!response.ok) {
    throw new Error("Error capturing payment.");
  }
  return response.json(); // Expecting the saved appointment
};

// Cancel appointment
export const cancelAppointmentAPI = async (appointmentID) => {
  const response = await fetch(
    `${BASE_URL}/appointment/cancel/${appointmentID}`,
    { method: "DELETE" }
  );
  if (!response.ok) {
    throw new Error("Error canceling appointment.");
  }
  return response.json();
};

// Update appointment
export const updateAppointmentAPI = async (
  appointmentID,
  appointmentDetails
) => {
  const response = await fetch(
    `${BASE_URL}/appointment/update-appointment/${appointmentID}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentDetails }),
    }
  );
  if (!response.ok) {
    throw new Error("Error updating appointment.");
  }
  return response.json();
};

// Fetch available specialists for treatment
export const fetchAvailableSpecialists = async (treatmentName) => {
  const response = await fetch(
    `${BASE_URL}/appointment/available-specialists?treatmentName=${treatmentName}`
  );
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(
      responseData.message || "Error loading available specialists."
    );
  }
  return response.json();
};

// // Fetch available dates for a specialist
// export const fetchAvailableDatesForSpecialist = async (specialistId) => {
//   const response = await fetch(
//     `${BASE_URL}/shift/available-dates/${specialistId}`
//   );
//   if (!response.ok) {
//     throw new Error(
//       "Error fetching available dates of the Working Hour of the MedicalSpecialist"
//     );
//   }
//   return response.json();
// };

// // Fetch available shifts for a specific specialist
// export const fetchShiftsForSpecialist = async (specialistID) => {
//   const response = await fetch(
//     `${BASE_URL}/appointment/shifts?medicalSpecialistID=${specialistID}`
//   );
//   if (!response.ok) {
//     throw new Error("Error fetching shifts");
//   }
//   return response.json(); // Assuming the server returns JSON formatted shifts
// };

// Fetch appointments
export const fetchAppointmentsAPI = async (patientID) => {
  const response = await fetch(
    `${BASE_URL}/appointment/patient/?patientID=${patientID}`,
    { method: "GET" }
  );
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || "Error loading appointments.");
  }
  console.log(
    `appointmentsAPI fetching appointments for patient: ${patientID} appointments ${response} `
  );
  return response.json();
};
