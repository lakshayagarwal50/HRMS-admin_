//imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 
import { fetchEmployeeDetails } from './employeeSlice';

//interfaces
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
//thunk for update proffessional info
export const updateProfessionalInfo = createAsyncThunk<
  ApiResponse,
  { professionalId: string; empCode: string; professionalData: ProfessionalInfoPayload },
  { rejectValue: string }
>(
  'professional/updateDetails',
  async ({ professionalId, empCode, professionalData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/employees/professional/${professionalId}`,
        professionalData
      );
      dispatch(fetchEmployeeDetails(empCode));
      return response.data as ApiResponse;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to update professional info.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

//slice
const professionalSlice = createSlice({
  name: 'professional',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfessionalInfo.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateProfessionalInfo.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateProfessionalInfo.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export default professionalSlice.reducer;