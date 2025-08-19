import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';
import { fetchEmployeeDetails, type EmployeeDetail } from './employeeSlice';

const API_BASE_URL = 'http://172.50.5.116:3000/employees';

const getAuthToken = (): string | null => {
  return localStorage.getItem('token'); // Ensure the key matches your auth logic
};

// Define the data types for a previous job
export interface PreviousJob {
  id: string;
  name: string;
  address: string;
  lastDate: string;
  ctc: string;
  grossAmt: string;
  taxAmt: string;
  taxPaid: string;
  employeePF: string;
  employerPF: string;
  professionalTax: string;
}

export interface CreatePreviousJobPayload {
  name: string;
  address: string;
  lastDate: string;
  ctc: string;
  grossAmt: string;
  taxAmt: string;
  taxPaid: string;
  employeePF: string;
  employerPF: string;
  professionalTax: string;
}

export interface EditPreviousJobPayload {
  jobId: string;
  name?: string;
  address?: string;
  lastDate?: string;
  ctc?: string;
  grossAmt?: string;
  taxAmt?: string;
  taxPaid?: string;
  employeePF?: string;
  employerPF?: string;
  professionalTax?: string;
}

// Define the state for this slice
interface PreviousJobState {
  loading: boolean;
  error: string | null;
}

const initialState: PreviousJobState = {
  loading: false,
  error: null,
};

// Async thunk for adding a new previous job
export const addPreviousJob = createAsyncThunk<
  void,
  { empId: string; employeeCode: string; jobData: CreatePreviousJobPayload },
  { rejectValue: string }
>(
  'previousJob/addPreviousJob',
  async ({ empId, employeeCode, jobData }, { dispatch, rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }

    try {
      await axios.post(`${API_BASE_URL}/proviousJob/${empId}`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchEmployeeDetails(employeeCode));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add previous job');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Async thunk for editing an existing previous job
export const editPreviousJob = createAsyncThunk<
  void,
  { empId: string; employeeCode: string; payload: EditPreviousJobPayload },
  { rejectValue: string }
>(
  'previousJob/editPreviousJob',
  async ({ empId, employeeCode, payload }, { dispatch, rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }

    try {
      await axios.patch(`${API_BASE_URL}/proviousJob/${payload.jobId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchEmployeeDetails(employeeCode));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to edit previous job');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Slice Definition
const previousJobSlice = createSlice({
  name: 'previousJob',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Previous Job
      .addCase(addPreviousJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPreviousJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addPreviousJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Edit Previous Job
      .addCase(editPreviousJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPreviousJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editPreviousJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default previousJobSlice.reducer;