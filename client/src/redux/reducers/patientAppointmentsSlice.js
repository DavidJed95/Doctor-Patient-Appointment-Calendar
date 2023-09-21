import { createSlice } from '@reduxjs/toolkit';

export const patientProfileSlice = createSlice({
  name: 'patientAppointments',
  initialState: [],
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
    updateAppointment: (state, action) => {
      const index = state.findIndex(
        appointment =>
          appointment.PatientID === action.payload.PatientID &&
          appointment.MedicalSpecialistID ===
            action.payload.MedicalSpecialistID &&
          appointment.AppointmentID === action.payload.AppointmentID,
      );
      if (index !== -1) {
        state[index] = action.payload;
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
