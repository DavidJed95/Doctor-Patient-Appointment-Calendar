// export const fetchShiftsAPI = async () => {
//   const response = await fetch('/shift');
//   if (!response.ok) {
//     throw new Error('Error loading shifts.');
//   }
//   return response.json();
// };

export const addAppointmentAPI = async event => {
  const response = await fetch('/appointment/create-appointment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Error adding shift.');
  }
  return response.json();
};

export const updateAppointmentAPI = async (appointmentID, updatedAppointment) => {
  const response = await fetch(`/appointment/${appointmentID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAppointment),
  });
  if (!response.ok) {
    throw new Error('Error updating shift.');
  }
  return response.json();
};

export const deleteAppointmentAPI = async appointmentID => {
  const response = await fetch(`/appointment/${appointmentID}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error deleting shift.');
  }
  return response.json();
};
