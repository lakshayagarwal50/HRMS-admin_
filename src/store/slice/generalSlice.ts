
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';
import { fetchEmployeeDetails } from './employeeSlice';


const API_BASE_URL = 'http://172.50.5.116:3000/employees';


const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken'); // Ensure the key matches your auth logic
};


interface GeneralInfoPayload {
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
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/general/${generalId}`,
        generalData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // On success, refresh all employee data
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
