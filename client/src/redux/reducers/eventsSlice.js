import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as shiftsAPI from '../../components/medicalSpecialist/shiftsAPI';
/**
 * fetchShifts thunk
 */
export const fetchShifts = createAsyncThunk(
  'events/fetchShifts',
  async (medicalSpecialistID, { rejectWithValue }) => {
    try {
      const response = await shiftsAPI.fetchShiftsAPI(medicalSpecialistID);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Add Shift thunk
 */
export const addShift = createAsyncThunk(
  'events/addShift',
  async (shiftDetails, { rejectWithValue }) => {
    try {
      const response = await shiftsAPI.addShiftAPI(shiftDetails);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Update Shift thunk
 */
export const updateShift = createAsyncThunk(
  'events/updateShift',
  async ({ shiftID, shiftDetails }, { rejectWithValue }) => {
    try {
      const response = await shiftsAPI.updateShiftAPI(shiftID, shiftDetails);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Delete Shift thunk
 */
export const deleteShift = createAsyncThunk(
  'events/deleteShift',
  async (shiftID, { rejectWithValue }) => {
    try {
      const response = await shiftsAPI.deleteShiftAPI(shiftID);
      return { shiftID, message: response.message }; // Include shiftID to identify which shift was deleted
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Events slice
export const eventsSlice = createSlice({
  name: 'events',
  initialState: { SpecialistAvailability: [], loading: false, error: null },
  reducers: {
    // Reducers for synchronous actions
  },
  extraReducers: builder => {
    builder
      // Handling fetchShifts
      .addCase(fetchShifts.pending, state => {
        state.loading = true;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.SpecialistAvailability = action.payload;
        state.loading = false;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Handling addShift
      .addCase(addShift.fulfilled, (state, action) => {
        state.SpecialistAvailability.push(action.payload);
        // You may need to adjust this based on the response structure
      })
      // Handling updateShift
      .addCase(updateShift.fulfilled, (state, action) => {
        const index = state.SpecialistAvailability.findIndex(
          event => event.id === action.meta.arg.shiftID,
        );
        if (index !== -1) {
          state.SpecialistAvailability[index] = {
            ...state.SpecialistAvailability[index],
            ...action.payload,
          };
          // Adjust based on your actual response structure
        }
      })
      // Handling deleteShift
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.SpecialistAvailability = state.SpecialistAvailability.filter(
          event => event.id !== action.payload.shiftID,
        );
      });   
  },
});

export default eventsSlice.reducer;
