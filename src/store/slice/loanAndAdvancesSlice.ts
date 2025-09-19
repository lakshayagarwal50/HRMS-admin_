
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 
import type { RootState } from '../store';


export interface LoanAPIResponse {
  id: string;
  name: string;
  amountReq: string;
  status: string;
  amountApp: string;
  installment: string;
  balanced: string;
  requestDate: string;
}

export interface Loan {
  note: string;
  approvedBy: string;
  staffNote: string;
  id: string;
  employeeName: string;
  requestedAmount: string;
  status: "Approved" | "Canceled" | "Pending" | "Paid" | "Declined";
  approvedAmount: string;
  installments: string;
  balance: string;
  requestDate: string; 
}

interface LoansState {
  loans: Loan[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalItems: number; 
  totalPages: number;
}

const initialState: LoansState = {
  loans: [],
  status: 'idle',
  error: null,
  totalItems: 0,
  totalPages: 1,
};


const transformApiLoan = (apiLoan: LoanAPIResponse): Loan => ({
  id: apiLoan.id,
  employeeName: apiLoan.name,
  requestedAmount: `₹ ${Number(apiLoan.amountReq).toLocaleString('en-IN')}`,
  status: (apiLoan.status.charAt(0).toUpperCase() + apiLoan.status.slice(1)) as Loan['status'],
  approvedAmount: `₹ ${Number(apiLoan.amountApp).toLocaleString('en-IN')}`,
  installments: apiLoan.installment,
  balance: `₹ ${Number(apiLoan.balanced).toLocaleString('en-IN')}`,
  requestDate: apiLoan.requestDate, // This seems to be hardcoded
  note: '',
  approvedBy: '',
  staffNote: ''
});


interface FetchLoansArgs {
    page?: number;
    limit?: number;
    search?: string; 
    startDate?: string;
    endDate?: string;
    statuses?: string[];
}

export const fetchLoans = createAsyncThunk(
  'loans/fetchLoans',
  async (args: FetchLoansArgs = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search, startDate, endDate, statuses } = args;
      
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      
      if (search) {
        params.append('search', search);
      }
      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }
      if (statuses && statuses.length > 0) {
        params.append('status', statuses.map(s => s.toLowerCase()).join(','));
      }
      
      const response = await axiosInstance.get(`/loan/getAll?${params.toString()}`);
      
      const data = response.data.loans; 
      const totalCount = response.data.total;

      return {
        loans: data.map(transformApiLoan),
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'An unknown error occurred');
    }
  }
);


interface UpdateLoanPayload {
  loanId: string;
  amountApp: string;
  staffNote: string;
}

export const updateLoan = createAsyncThunk(
  'loans/updateLoan',
  async (payload: UpdateLoanPayload, { rejectWithValue }) => {
    try {
      const { loanId, amountApp, staffNote } = payload;
     
      await axiosInstance.patch(
        `/loan/edit/${loanId}`,
        { amountApp, staffNote }
      );
      
      return payload;

    } catch (error) {
      return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to update loan');
    }
  }
);


interface ApproveLoanPayload {
  loanId: string;
  amountApp: string;
  installment: string;
  date: string;
  staffNote: string;
}

export const approveLoan = createAsyncThunk(
  'loans/approveLoan',
  async (payload: ApproveLoanPayload, { rejectWithValue }) => {
    try {
      const { loanId, ...requestBody } = payload;
      
      await axiosInstance.post(
        `/loan/approvedLoan/${loanId}`,
        requestBody
      );
      
      return payload;

    } catch (error) {
      return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to approve loan');
    }
  }
);


interface CancelLoanPayload {
  loanId: string;
  cancelReason: string;
}

export const cancelLoan = createAsyncThunk(
  'loans/cancelLoan',
  async ({ loanId, cancelReason }: CancelLoanPayload, { rejectWithValue }) => {
    try {
      
      await axiosInstance.post(
        `/loan/cancelLoan/${loanId}`,
        { cancelReason }
      );

      return { loanId };

    } catch (error) {
      return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to cancel loan');
    }
  }
);


const loanAndAdvancesSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoans.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loans = action.payload.loans;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      .addCase(updateLoan.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateLoan.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { loanId, amountApp } = action.payload;
        const index = state.loans.findIndex(loan => loan.id === loanId);
        if (index !== -1) {
            state.loans[index].approvedAmount = `₹ ${Number(amountApp).toLocaleString('en-IN')}`;
        }
      })
      .addCase(updateLoan.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Approve Loan
      .addCase(approveLoan.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(approveLoan.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.loans.findIndex(loan => loan.id === action.payload.loanId);
        if (index !== -1) {
            state.loans[index].status = 'Approved';
            state.loans[index].approvedAmount = `₹ ${Number(action.payload.amountApp).toLocaleString('en-IN')}`;
            state.loans[index].installments = action.payload.installment;
        }
      })
      .addCase(approveLoan.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Cancel Loan
      .addCase(cancelLoan.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(cancelLoan.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.loans.findIndex(loan => loan.id === action.payload.loanId);
        if (index !== -1) {
            state.loans[index].status = 'Declined';
        }
      })
      .addCase(cancelLoan.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default loanAndAdvancesSlice.reducer;