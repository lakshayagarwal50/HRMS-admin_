//imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 
import { fetchEmployeeDetails } from './employeeSlice';

const API_BASE_PATH = '/employees';

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

interface PreviousJobState {
  loading: boolean;
  error: string | null;
}

const initialState: PreviousJobState = {
  loading: false,
  error: null,
};

//thunk for add job
export const addPreviousJob = createAsyncThunk<
  void,
  { empId: string; employeeCode: string; jobData: CreatePreviousJobPayload },
  { rejectValue: string }
>(
  'previousJob/addPreviousJob',
  async ({ empId, employeeCode, jobData }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post(`${API_BASE_PATH}/proviousJob/${empId}`, jobData);
      dispatch(fetchEmployeeDetails(employeeCode));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add previous job');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

//thunk for edit previous job
export const editPreviousJob = createAsyncThunk<
  void,
  { empId: string; employeeCode: string; payload: EditPreviousJobPayload },
  { rejectValue: string }
>(
  'previousJob/editPreviousJob',
  async ({ empId, employeeCode, payload }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.patch(`${API_BASE_PATH}/proviousJob/${payload.jobId}`, payload);
      dispatch(fetchEmployeeDetails(employeeCode));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to edit previous job');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

//slice
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