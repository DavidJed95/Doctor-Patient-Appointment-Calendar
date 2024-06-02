import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import * treatmentAPI from '../../components/treatments/treatmentsAPI';

export const fetchTreatmentPrice = createAsyncThunk(
    'treatments/fetchTreatmentPrice',
    async (treatmentID, { rejectWithValue }) => {
        try {
            // const response = await treatmentsAPI.fetchTreatmentPriceAPI(treatmentID);
            // return response;
        } catch (error) {
            return rejectWithValue(error.message)            
        }
    }
);

export const treatmentsSlice = createSlice({
    name: 'treatments',
    initialState: { price: 0, loading: false, error: null },
    reducers: {},
    extraReducers: builder => {
      builder
        .addCase(fetchTreatmentPrice.pending, state => {
          state.loading = true;
        })
        .addCase(fetchTreatmentPrice.fulfilled, (state, action) => {
          state.price = action.payload;
          state.loading = false;
        })
        .addCase(fetchTreatmentPrice.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        });
    },
  });
  
  export default treatmentsSlice.reducer;