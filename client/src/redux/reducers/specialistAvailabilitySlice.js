import { createSlice } from '@reduxjs/toolkit';

export const specialistAvailabilitySlice = createSlice({
  name: 'specialistAvailability',
  initialState: [],
  reducers: {
    setAvailability: (state, action) => {
      state.push(action.payload);
    },
    removeAvailability: (state, action) => {
      return state.filter(
        availability =>
          availability.MedicalSpecialistID !==
          action.payload.MedicalSpecialistID,
      ); //MedicalSpecialistID in the mySQL specialistHours table SpecialistHours(SpecialistHourID, MedicalSpecialistID, DayOfWeek, StartTime, EndTime, Type)
    },
    updateAvailability: (state, action) => {
      const index = state.findIndex(
        availability =>
          availability.MedicalSpecialistID ===
          action.payload.MedicalSpecialistID,
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { setAvailability, removeAvailability, updateAvailability } =
  specialistAvailabilitySlice.actions;
export default specialistAvailabilitySlice.reducer;
