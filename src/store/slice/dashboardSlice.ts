import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- TYPE DEFINITIONS ---
export interface DashboardCounts {
  activeEmployees: number;
  payslipCount: number;
  grossPaid: number;
  netPaid: number;
}

export interface DashboardState {
  counts: DashboardCounts | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DashboardState = {
  counts: null,
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---
export const fetchDashboardCounts = createAsyncThunk(
  'dashboard/fetchCounts',
  async (_, { rejectWithValue }) => {
    try {
      const token = "YOUR_FIREBASE_ID_TOKEN"; // Replace with your token logic
      const response = await axiosInstance.get('/api/totalCounts/activeEmployees/get', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const apiData = response.data as { total: number };
      // Only activeEmployees is from API, others are static demo
      const transformedData: DashboardCounts = {
        activeEmployees: apiData.total,
        payslipCount: 120, // Demo
        grossPaid: 80000,  // Demo
        netPaid: 50000,    // Demo
      };
      return transformedData;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard counts');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// --- SLICE DEFINITION ---
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardCounts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardCounts.fulfilled, (state, action: PayloadAction<DashboardCounts>) => {
        state.status = 'succeeded';
        state.counts = action.payload;
      })
      .addCase(fetchDashboardCounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
