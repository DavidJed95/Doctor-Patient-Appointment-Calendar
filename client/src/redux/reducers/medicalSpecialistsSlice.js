import { createSlice } from '@reduxjs/toolkit';

export const medicalSpecialistsSlice = createSlice({
  name: 'medicalSpecialists',
  initialState: [],
  reducers: {
    setMedicalSpecialists: (state, action) => {
      return action.payload;
    },
  },
});

export const { setMedicalSpecialists } = medicalSpecialistsSlice.actions;

export default medicalSpecialistsSlice.reducer;
