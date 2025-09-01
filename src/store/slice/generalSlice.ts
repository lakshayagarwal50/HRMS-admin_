
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 
import { fetchEmployeeDetails } from './employeeSlice';


interface GeneralInfoPayload {
  [key: string]: any;
}

interface ApiResponse {
  message: string;
}

interface GeneralState {
  loginDetails: any;
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
      const response = await axiosInstance.patch(
        `/employees/general/${generalId}`,
        generalData
      );
      dispatch(fetchEmployeeDetails(empCode));
      return response.data as ApiResponse;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
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
      .addCase(updateGeneralInfo.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateGeneralInfo.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateGeneralInfo.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export default generalSlice.reducer;