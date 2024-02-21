import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as shiftsAPI from '../../components/medicalSpecialist/shiftsAPI';

export const fetchShifts = createAsyncThunk(
  'events/fetchShifts',
  async (specialistID, { rejectWithValue }) => {
    try {
      const response = await shiftsAPI.fetchShiftsAPI(specialistID);
      return response.map(shift => ({
        ...shift,
        start: new Date(shift.start),
        end: new Date(shift.end),
        eventType: 'specialistAvailability',
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const eventsSlice = createSlice({
  name: 'events',
  initialState: { SpecialistAvailability: [], loading: false, error: null },
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
  extraReducers: {
    [fetchShifts.pending]: state => {
      state.loading = true;
    },
    [fetchShifts.fulfilled]: (state, action) => {
      state.specialistAvailability = action.payload;
      state.loading = false;
    },
    [fetchShifts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
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
