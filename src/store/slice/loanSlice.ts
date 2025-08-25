

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';
import { fetchEmployeeDetails } from './employeeSlice';


const API_BASE_URL = 'http://172.50.5.49:3000/employees';


const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken'); // Ensure the key matches your auth logic
};


export interface PaybackTerm {
  installment: string;
  date: string;
  remaining: string;
}

export interface LoanDetails {
  approvedBy: string;
  id: string;
  amountReq: string;
  amountApp?: string;
  reqDate: string;
  paybackTerm?: PaybackTerm;
  note?: string;
  staffNote?: string;
  status: 'pending' | 'approved' | 'declined' | 'cancelled';
  cancelReason?: string;
  empName: string;
  activity?: string[];
  balance: string;
}

export interface CreateLoanPayload {
  empName: string;
  amountReq: string;
  staffNote: string;
  note: string;
}

export interface ApproveLoanPayload {
  loanId: string;
  amountApp: string;
  installment: string;
  date: string;
  staffNote: string;
}

export interface CancelLoanPayload {
  loanId: string;
  cancelReason: string;
}

export interface EditLoanPayload {
  loanId: string;
  amountApp: string;
  staffNote: string;
}


export const addLoanRequest = createAsyncThunk<
  void,
  { employeeId: string; employeeCode: string; loanData: CreateLoanPayload }
>(
  'loan/addLoanRequest',
  async (payload, { dispatch, rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }

    console.log('--- DEBUG: Full payload received by action ---');
    console.log(payload);
    const { employeeId, employeeCode, loanData } = payload;

    try {
      await axios.post(`${API_BASE_URL}/loan/${employeeId}`, loanData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchEmployeeDetails(employeeCode));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add loan request');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const approveLoan = createAsyncThunk<
  void,
  { employeeId: string; payload: ApproveLoanPayload & { loanId: string } }
>(
  'loan/approveLoan',
  async ({ employeeId, payload }, { dispatch, rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }

    try {
      const { loanId, ...loanData } = payload;
      await axios.post(`${API_BASE_URL}/approvedLoan/${loanId}`, loanData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchEmployeeDetails(employeeId));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to approve loan');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const cancelLoan = createAsyncThunk<
  void,
  { employeeId: string; payload: CancelLoanPayload }
>(
  'loan/cancelLoan',
  async ({ employeeId, payload }, { dispatch, rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }

    try {
      await axios.post(`${API_BASE_URL}/cancelLoan/${payload.loanId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchEmployeeDetails(employeeId));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to cancel loan');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const editLoan = createAsyncThunk<
  void,
  { employeeId: string; employeeCode: string; payload: EditLoanPayload }
>(
  'loan/editLoan',
  async ({ employeeId, employeeCode, payload }, { dispatch, rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }

    try {
      await axios.patch(`${API_BASE_URL}/loan/${payload.loanId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchEmployeeDetails(employeeCode));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to edit loan');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// --- SLICE DEFINITION ---
const loanSlice = createSlice({
  name: 'loan',
  initialState: {
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Loan
      .addCase(addLoanRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLoanRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addLoanRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Approve Loan
      .addCase(approveLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveLoan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(approveLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel Loan
      .addCase(cancelLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelLoan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Edit Loan
      .addCase(editLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editLoan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default loanSlice.reducer;
