
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 
import { fetchEmployeeDetails } from './employeeSlice';

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
  async ({ employeeId, employeeCode, loanData }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post(`/employees/loan/${employeeId}`, loanData);
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
    try {
      const { loanId, ...loanData } = payload;
      await axiosInstance.post(`/employees/approvedLoan/${loanId}`, loanData);
      dispatch(fetchEmployeeDetails(employeeId));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || 'Failed to approve loan');
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
    try {
      await axiosInstance.post(`/employees/cancelLoan/${payload.loanId}`, payload);
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
    try {
      await axiosInstance.patch(`/employees/loan/${payload.loanId}`, payload);
      dispatch(fetchEmployeeDetails(employeeCode));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to edit loan');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

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