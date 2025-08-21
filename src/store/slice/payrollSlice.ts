// src/store/slice/payrollSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../services/index'; // Assuming API service

// Type imports from types/payroll.ts (create if needed)
interface PayrollState {
  list: PayrollPeriodSummary[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PayrollState = {
  list: [],
  isLoading: false,
  error: null,
};

export const fetchPayrollList = createAsyncThunk(
  'payroll/fetchList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/payroll/list');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll list');
    }
  }
);

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayrollList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayrollList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchPayrollList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default payrollSlice.reducer;