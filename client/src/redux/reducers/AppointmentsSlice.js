import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createOrderAPI,
  capturePaymentAndSaveAppointmentAPI,
  fetchAppointmentsAPI,
  cancelAppointmentAPI,
  updateAppointmentAPI,
  fetchAvailableSpecialists,
} from "../../components/patient/appointmentsAPI";

// Create PayPal order
export const createOrder = createAsyncThunk(
  "appointments/createOrderAPI",
  async ( amount , { rejectWithValue }) => {
    console.log(`Within Appointment slice creating appointment order`);
    try {
      const response = await createOrderAPI(amount);
      return response; // {approvalUrl}
    } catch (error) {
      console.error(
        `Something went wrong when trying create the appointment in the slice ${error}`
      );
      return rejectWithValue(error.message);
    }
  }
);

// Capture payment and save appointment
export const capturePaymentAndSaveAppointment = createAsyncThunk(
  "appointments/capturePaymentAndSaveAppointment",
  async ({ orderId, appointmentDetails }, { rejectWithValue }) => {
    console.log(`Within Appointment slice creating appointment order capture`);
    try {
      const response = await capturePaymentAndSaveAppointmentAPI(
        orderId,
        appointmentDetails
      );
      return response; // return response.savedAppointment; // Newly saved appointment
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete appointment
export const cancelAppointment = createAsyncThunk(
  "appointments/cancelAppointment",
  async (appointmentID, { rejectWithValue }) => {
    try {
      const response = await cancelAppointmentAPI(appointmentID);
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
      const response = await updateAppointmentAPI(
        appointmentID,
        appointmentDetails
      );
      return response;
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
      const response = await fetchAvailableSpecialists(treatmentName);
      return response.specialists;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (patientID, { rejectWithValue }) => {
    try {
      const response = await fetchAppointmentsAPI(patientID);
      return response.appointments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    availableSpecialists: [],
    approvalUrl: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.loading = false;
        console.log("Appointments fetched in redux: ", state.appointments);
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.approvalUrl = action.payload.approvalUrl;
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(capturePaymentAndSaveAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
        state.loading = false;
      })
      .addCase(capturePaymentAndSaveAppointment.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (appointment) =>
            appointment.AppointmentId === action.meta.arg.appointmentID
        );
        if (index !== -1) {
          state.appointments[index] = {
            ...state.appointments[index],
            ...action.payload,
          };
        }
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(
          (appointment) => appointment.id !== action.payload.id
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
      });
  },
});

export default appointmentsSlice.reducer;
