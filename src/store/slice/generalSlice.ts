import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchEmployeeDetails } from './employeeSlice';

// NOTE: We assume the API endpoint for updating is PUT /employees/general/{id}
// Please adjust if your endpoint is different.

interface GeneralInfoPayload {
  // Define the properties that can be updated
  // This should match the form data
  [key: string]: any;
}

interface ApiResponse {
    message: string;
}

interface GeneralState {
  submitting: boolean;
  error: string | null;
}

const initialState: GeneralState = {
  submitting: false,
  error: null,
};

export const updateGeneralInfo = createAsyncThunk<
  ApiResponse,
  { generalId: string; empCode: string; generalData: GeneralInfoPayload },
  { rejectValue: string }
>(
  'general/updateDetails',
  async ({ generalId, empCode, generalData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/employees/general/${generalId}`,
        generalData
      );
      // On success, refresh all employee data
      dispatch(fetchEmployeeDetails(empCode));
      return response.data as ApiResponse;
    } catch (error) {
       if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to update general info.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateGeneralInfo.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(updateGeneralInfo.fulfilled, (state) => { state.submitting = false; })
      .addCase(updateGeneralInfo.rejected, (state, action) => { state.submitting = false; state.error = action.payload as string; });
  },
});

export default generalSlice.reducer;