import { BASE_URL } from "../../config";

export const fetchAppointmentsAPI = async (patientID) => {
  const response = await fetch(`${BASE_URL}appointment?patientID=${patientID}`);
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || "Error loading appointments.");
  }
  return response.json();
};

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

export const deleteAppointmentAPI = async (appointmentID) => {
  const response = await fetch(`${BASE_URL}/appointment/${appointmentID}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error deleting appointment.");
  }
  return response.json();
};

export const fetchAvailableSpecialists = async (selectedDate) => {
  const response = await fetch(`${BASE_URL}/shift/available-specialists?date=${selectedDate}`);
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(
      responseData.message || "Error loading available specialists."
    );
  }
  return response.json();
};

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