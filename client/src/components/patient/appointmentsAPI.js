import { BASE_URL } from "../../config";
// Fetch appointments
export const fetchAppointmentsAPI = async (patientID) => {
  const response = await fetch(`${BASE_URL}appointment?patientID=${patientID}`);
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || "Error loading appointments.");
  }
  return response.json();
};
// Create an appointment (with PayPal payment initiation)
//TODO: changed from addAppointment to createPayPalPayment (was the same root) -> now go to redux AppointmentSlice.js
export const createPayPalPayment = async (appointmentData) => {
  const response = await fetch(`${BASE_URL}/appointment/create-appointment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointmentData),
  });
  if (!response.ok) {
    throw new Error("Error adding appointment.");
  }
  return response.json();
};

// Execute PayPal payment after approval
export const executePayPalPayment = async (paymentData) => {
  const response = await fetch(`${BASE_URL}/appointment/execute-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
  if (!response.ok) {
    throw new Error("Error initiating PayPal payment.");
  }
  return response.json();
};

// Refund a PayPal payment
export const refundPayPalPayment = async (appointmentID) => {
  const response = await fetch(
    `${BASE_URL}/appointment/refund/${appointmentID}`,
    { method: "GET" }
  );
  if (!response.ok) {
    throw new Error("Error processing refund.");
  }
  return response.json();
};

// addAppointment function
export const addAppointmentAPI = async (event) => {
  const response = await fetch(`${BASE_URL}/appointment/create-appointment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error("Error adding appointment.");
  }
  return response.json();
};

// Update appointment
export const updateAppointmentAPI = async (
  appointmentID,
  updatedAppointment
) => {
  const response = await fetch(`${BASE_URL}/appointment/${appointmentID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedAppointment),
  });
  if (!response.ok) {
    throw new Error("Error updating appointment.");
  }
  return response.json();
};

// Delete appointment
export const deleteAppointmentAPI = async (appointmentID) => {
  const response = await fetch(`${BASE_URL}/appointment/${appointmentID}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error deleting appointment.");
  }
  return response.json();
};

// Fetch available specialists for treatment
export const fetchAvailableSpecialists = async (treatmentName) => {
  const response = await fetch(`${BASE_URL}/appointment/available-specialists?treatmentName=${treatmentName}`);
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || 'Error loading available specialists.');
  }
  return response.json();
}

// Fetch available dates for a specialist
export const fetchAvailableDatesForSpecialist = async (specialistId) => {
  const response = await fetch(
    `${BASE_URL}/shift/available-dates/${specialistId}`
  );
  if (!response.ok) {
    throw new Error(
      "Error fetching available dates of the Working Hour of the MedicalSpecialist"
    );
  }
  return response.json();
};

// Fetch available shifts for a specific specialist
export const fetchShiftsForSpecialist = async (specialistID) => {
  const response = await fetch(`${BASE_URL}/appointment/shifts?medicalSpecialistID=${specialistID}`);
  if (!response.ok) {
    throw new Error('Error fetching shifts');
  }
  return response.json(); // Assuming the server returns JSON formatted shifts
};