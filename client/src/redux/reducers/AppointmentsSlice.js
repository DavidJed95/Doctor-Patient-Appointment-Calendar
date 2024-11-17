import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as appointmentsAPI from "../../components/patient/appointmentsAPI";

// Fetch appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (patientID, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.fetchAppointmentsAPI(patientID);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add appointment
export const addAppointment = createAsyncThunk(
  "appointments/addAppointment",
  async (appointmentDetails, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.addAppointmentAPI(
        appointmentDetails
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Initiate PayPal payment
export const initiatePayPalPayment = createAsyncThunk(
  "appointments/initiatePayPalPayment",
  async (appointmentDetails, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.createPayPalPayment(
        appointmentDetails
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Execute PayPal payment after approval (for extra security)
export const executePayPalPayment = createAsyncThunk(
  "appointments/executePayPalPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.executePayPalPayment(paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Refund PayPal payment
export const initiatePayPalRefund = createAsyncThunk(
  "appointments/initiatePayPalRefund",
  async (appointmentID, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.refundPayPalPayment(appointmentID);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update appointment
export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async ({ appointmentID, appointmentDetails }, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.updateAppointmentAPI(
        appointmentID,
        appointmentDetails
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete appointment
export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",
  async (appointmentID, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.deleteAppointmentAPI(
        appointmentID
      );
      return { appointmentID, message: response.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetching specialists according to specialization
export const fetchSpecialistsForTreatment = createAsyncThunk(
  "appointments/fetchSpecialistsForTreatment",
  async (treatmentName, { rejectWithValue }) => {
    try {
      const response = await appointmentsAPI.fetchAvailableSpecialists(
        treatmentName
      );
      return response.specialists;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  appointments: [],
  availableSpecialists: [],
  loading: false,
  error: null,
  paymentApprovalUrl: null
};

export const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
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
          (appointment) => appointment.id === action.meta.arg.appointmentID
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
          (appointment) => appointment.id !== action.payload.appointmentID
        );
      })
      .addCase(fetchSpecialistsForTreatment.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSpecialistsForTreatment.fulfilled, (state, action) => {
        state.availableSpecialists = action.payload;
        state.loading = false;
      })
      .addCase(fetchSpecialistsForTreatment.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // New: Handle initiatePayPalPayment
      .addCase(initiatePayPalPayment.fulfilled, (state, action) => {
        state.paymentApprovalUrl = action.payload.approvalUrl;
      })
      .addCase(initiatePayPalPayment.rejected, (state, action) => {
        state.error = action.payload;
      })
      // New: Handle initiatePayPalRefund
      .addCase(initiatePayPalRefund.fulfilled, (state, action) => {
        state.feedback = "Refund processed successfully!";
      })
      .addCase(initiatePayPalRefund.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default appointmentsSlice.reducer;
