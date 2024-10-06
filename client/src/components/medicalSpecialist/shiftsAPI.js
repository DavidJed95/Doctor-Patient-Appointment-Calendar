import { BASE_URL } from '../../config';

export const fetchShiftsForSpecialist = async medicalSpecialistID => {
  const response = await fetch(
    `${BASE_URL}/shift?medicalSpecialistID=${medicalSpecialistID}`,
  );
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || 'Error loading shifts.');
  }
  return response.json();
};

export const addShiftAPI = async event => {
  const response = await fetch(`${BASE_URL}/shift`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || 'Error adding shift.');
  }
  return response.json();
};

export const updateShiftAPI = async (shiftID, updatedShift) => {
  const response = await fetch(`${BASE_URL}/shift/${shiftID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedShift),
  });
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || 'Error updating shift.');
  }
  return response.json();
};

export const deleteShiftAPI = async shiftID => {
  const response = await fetch(`${BASE_URL}/shift/${shiftID}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || 'Error deleting shift.');
  }
  return response.json();
};
