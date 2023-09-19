import { createSlice } from '@reduxjs/toolkit';

export const patientProfileSlice = createSlice({
  name: 'patientProfile',
  initialState: {},
  reducers: {
    setPatientProfile: (state, action) => {
      state = action.payload;
    },
    addAppointmentToPatient: (state, action) => {
      if (!state.appointments) {
        state.appointments = [];
      }
      state.appointments.push(action.payload);
    },
    removeAppointmentFromPatient: (state, action) => {
      if (state.appointments) {
        state.appointments = state.appointments.filter(
          appointment => appointment.id !== action.payload.id,
        );
      }
    },
  },
});

export const {
  setPatientProfile,
  addAppointmentToPatient,
  removeAppointmentFromPatient,
} = patientProfileSlice.actions;
export default patientProfileSlice.reducer;
