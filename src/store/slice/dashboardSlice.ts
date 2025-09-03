import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- TYPE DEFINITIONS ---

// This interface now matches the exact structure from your new API response
interface ApiCounts {
  totalActiveEmployees: number;
  totalPayslipCounts: number;
  totalGrossPaid: number;
  totalNetPaid: number;
}

// This is the shape of the data that your UI components will use
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
      const response = await axiosInstance.get('/totalCounts/get');
      const apiData = response.data as ApiCounts;

      // Transform the new API data into the format the UI expects
      const transformedData: DashboardCounts = {
        activeEmployees: apiData.totalActiveEmployees,
        payslipCount: apiData.totalPayslipCounts,
        grossPaid: apiData.totalGrossPaid,
        netPaid: apiData.totalNetPaid,
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

