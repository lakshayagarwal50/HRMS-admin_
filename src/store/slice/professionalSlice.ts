import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchEmployeeDetails } from './employeeSlice';


interface ProfessionalInfoPayload {
  [key: string]: any;
}

interface ApiResponse {
    message: string;
}

interface ProfessionalState {
  submitting: boolean;
  error: string | null;
}

const initialState: ProfessionalState = {
  submitting: false,
  error: null,
};

export const updateProfessionalInfo = createAsyncThunk<
  ApiResponse,
  { professionalId: string; empCode: string; professionalData: ProfessionalInfoPayload },
  { rejectValue: string }
>(
  'professional/updateDetails',
  async ({ professionalId, empCode, professionalData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/employees/professional/${professionalId}`,
        professionalData
      );
      dispatch(fetchEmployeeDetails(empCode));
      return response.data as ApiResponse;
    } catch (error) {
       if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to update professional info.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

const professionalSlice = createSlice({
  name: 'professional',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfessionalInfo.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(updateProfessionalInfo.fulfilled, (state) => { state.submitting = false; })
      .addCase(updateProfessionalInfo.rejected, (state, action) => { state.submitting = false; state.error = action.payload as string; });
  },
});

export default professionalSlice.reducer;