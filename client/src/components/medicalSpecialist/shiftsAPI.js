export const fetchShiftsAPI = async () => {
  const response = await fetch('/shift');
  if (!response.ok) {
    throw new Error('Error loading shifts.');
  }
  return response.json();
};

export const addShiftAPI = async event => {
  const response = await fetch('/shift', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Error adding shift.');
  }
  return response.json();
};

export const updateShiftAPI = async (shiftID, updatedShift) => {
  const response = await fetch(`/shift/${shiftID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedShift),
  });
  if (!response.ok) {
    throw new Error('Error updating shift.');
  }
  return response.json();
};

export const deleteShiftAPI = async shiftID => {
  const response = await fetch(`/shift/${shiftID}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error deleting shift.');
  }
  return response.json();
};
