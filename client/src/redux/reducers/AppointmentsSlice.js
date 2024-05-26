import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as appointmentsAPI from '../../components/patient/appointmentsAPI';

// Fetch appointments
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (patientID, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.fetchAppointmentsAPI(patientID);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Add appointment
export const addAppointment = createAsyncThunk(
  'appointments/addAppointment',
  async (appointmentDetails, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.addAppointmentAPI(
        appointmentDetails,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Update appointment
export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ appointmentID, appointmentDetails }, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.updateAppointmentAPI(
        appointmentID,
        appointmentDetails,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Delete appointment
export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (appointmentID, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.deleteAppointmentAPI(
        appointmentID,
      );
      return { appointmentID, message: response.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: { appointments: [], loading: false, error: null },
  reducers: {
    // Reducers for synchronous actions
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAppointments.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.loading = false;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          appointment => appointment.id === action.meta.arg.appointmentID,
        );
        if (index !== -1) {
          state.appointments[index] = {
            ...state.appointments[index],
            ...action.payload,
          };
        }
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(
          appointment => appointment.id !== action.payload.appointmentID,
        );
      });
  },
});

export default appointmentsSlice.reducer;
