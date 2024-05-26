import { BASE_URL } from '../../config';

export const fetchAppointmentsAPI = async patientID => {
  const response = await fetch(`${BASE_URL}appointment?patientID=${patientID}`);
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || 'Error loading appointments.');
  }
  return response.json();
};

export const addAppointmentAPI = async event => {
  const response = await fetch(`${BASE_URL}/appointment/create-appointment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Error adding appointment.');
  }
  return response.json();
};

export const updateAppointmentAPI = async (
  appointmentID,
  updatedAppointment,
) => {
  const response = await fetch(`${BASE_URL}/appointment/${appointmentID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAppointment),
  });
  if (!response.ok) {
    throw new Error('Error updating appointment.');
  }
  return response.json();
};

export const deleteAppointmentAPI = async appointmentID => {
  const response = await fetch(`${BASE_URL}/appointment/${appointmentID}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error deleting appointment.');
  }
  return response.json();
};
