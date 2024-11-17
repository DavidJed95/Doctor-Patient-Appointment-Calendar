import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import  * as treatmentsAPI from "../../components/treatments/treatmentsAPI";

export const fetchTreatments = createAsyncThunk(
  "treatments/fetchTreatments",
  async (_, { rejectWithValue }) => {  // Remove the object destructuring before rejectWithValue
    try {
      const response = await treatmentsAPI.fetchTreatments();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the treatments slice
export const treatmentsSlice = createSlice({
  name: "treatments",
  initialState: {
    treatments: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add synchronous reducers if necessary
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state for fetching treatments
      .addCase(fetchTreatments.pending, (state) => {
        state.loading = true;
      })
      // Handle fulfilled state with the fetched treatments
      .addCase(fetchTreatments.fulfilled, (state, action) => {
        state.treatments = action.payload;
        state.loading = false;
      })
      // Handle rejected state if fetching treatments fails
      .addCase(fetchTreatments.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// Export the reducer to be used in the store
export default treatmentsSlice.reducer;