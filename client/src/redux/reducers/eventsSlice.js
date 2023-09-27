import { createSlice } from '@reduxjs/toolkit';

export const eventsSlice = createSlice({
  name: 'events',
  initialState: [],
  reducers: {
    addSpecialistAvailability: (state, action) => {
      const newEvent = {
        ...action.payload,
        eventType: 'specialistAvailability',
      };
      state.push(newEvent);
    },
    addPatientAppointment: (state, action) => {
      const newEvent = {
        ...action.payload,
        eventType: 'patientAppointment',
      };
      state.push(newEvent);
    },
    removeEvent: (state, action) => {
      return state.filter(event => event.id !== action.payload.id);
    },
    updateEvent: (state, action) => {
      const index = state.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const {
  addSpecialistAvailability,
  addPatientAppointment,
  removeEvent,
  updateEvent,
} = eventsSlice.actions;

export default eventsSlice.reducer;
