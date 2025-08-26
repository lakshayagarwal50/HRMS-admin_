
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios, { isAxiosError } from 'axios';
// import type { RootState } from '../store';

// // --- Type Definitions ---
// export interface LoanAPIResponse {
//   id: string;
//   name: string;
//   amountReq: string;
//   status: string;
//   amountApp: string;
//   installment: string;
//   balanced: string;
// }

// export interface Loan {
//   note: string;
//   approvedBy: string;
//   staffNote: string;
//   id: string;
//   employeeName: string;
//   requestedAmount: string;
//   status: "Approved" | "Canceled" | "Pending" | "Paid" | "Declined";
//   approvedAmount: string;
//   installments: string;
//   balance: string;
//   requestDate: string; 
// }

// interface LoansState {
//   loans: Loan[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
//   totalItems: number; 
//   totalPages: number;
// }

// const initialState: LoansState = {
//   loans: [],
//   status: 'idle',
//   error: null,
//   totalItems: 0,
//   totalPages: 1,
// };

// // --- Helper Function for Data Transformation ---
// const transformApiLoan = (apiLoan: LoanAPIResponse): Loan => ({
//   id: apiLoan.id,
//   employeeName: apiLoan.name,
//   requestedAmount: `₹ ${Number(apiLoan.amountReq).toLocaleString('en-IN')}`,
//   status: (apiLoan.status.charAt(0).toUpperCase() + apiLoan.status.slice(1)) as Loan['status'],
//   approvedAmount: `₹ ${Number(apiLoan.amountApp).toLocaleString('en-IN')}`,
//   installments: apiLoan.installment,
//   balance: `₹ ${Number(apiLoan.balanced).toLocaleString('en-IN')}`,
//   requestDate: '25 Feb 2022',
//   note: '',
//   approvedBy: '',
//   staffNote: ''
// });


// // --- API Thunks ---

// // 1. FETCH ALL LOANS
// interface FetchLoansArgs {
//     page?: number;
//     limit?: number;
//     startDate?: string;
//     endDate?: string;
//     statuses?: string[];
// }

// export const fetchLoans = createAsyncThunk(
//   'loans/fetchLoans',
//   async (args: FetchLoansArgs = {}, { getState, rejectWithValue }) => {
//     try {
//       const { page = 1, limit = 10, startDate, endDate, statuses } = args;
//       const state = getState() as RootState;
//       const token = state.auth.accessToken;
//       if (!token) return rejectWithValue('Authentication token is missing');

//       const params = new URLSearchParams({ page: String(page), limit: String(limit) });
//       if (startDate) params.append('startDate', startDate);
//       if (endDate) params.append('endDate', endDate);
//       if (statuses && statuses.length > 0) {
//         params.append('status', statuses.map(s => s.toLowerCase()).join(','));
//       }

//       const response = await axios.get(`http://172.50.5.49:3000/loan/getAll?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       const data: LoanAPIResponse[] = response.data;
//       const totalCount = Number(response.headers['x-total-count'] || data.length);

//       return {
//         loans: data.map(transformApiLoan),
//         totalItems: totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//       };
//     } catch (error) {
//       return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'An unknown error occurred');
//     }
//   }
// );

// // 2. UPDATE A LOAN (EDIT)
// interface UpdateLoanPayload {
//   loanId: string;
//   amountApp: string;
//   staffNote: string;
// }

// // --- MODIFIED THUNK ---
// // This thunk now returns its own payload on success instead of relying on the API response body.
// export const updateLoan = createAsyncThunk(
//   'loans/updateLoan',
//   async (payload: UpdateLoanPayload, { getState, rejectWithValue }) => {
//     try {
//       const { loanId, amountApp, staffNote } = payload;
//       const state = getState() as RootState;
//       const token = state.auth.accessToken;
//       if (!token) return rejectWithValue('Authentication token is missing');

//       // The API call is made, but we don't need to process the response here.
//       await axios.patch(
//         `http://172.50.5.49:3000/loan/edit/${loanId}`,
//         { amountApp, staffNote },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       // On success, we return the original payload to the reducer.
//       return payload;

//     } catch (error) {
//       return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to update loan');
//     }
//   }
// );

// // 3. APPROVE A LOAN
// interface ApproveLoanPayload {
//   loanId: string;
//   amountApp: string;
//   installment: string;
//   date: string;
//   staffNote: string;
// }

// export const approveLoan = createAsyncThunk(
//   'loans/approveLoan',
//   async (payload: ApproveLoanPayload, { getState, rejectWithValue }) => {
//     try {
//       const { loanId, ...requestBody } = payload;
//       const state = getState() as RootState;
//       const token = state.auth.accessToken;
//       if (!token) return rejectWithValue('Authentication token is missing');

//       await axios.post(
//         `http://172.50.5.49:3000/loan/approvedLoan/${loanId}`,
//         requestBody,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       return payload;

//     } catch (error) {
//       return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to approve loan');
//     }
//   }
// );

// // 4. CANCEL A LOAN
// interface CancelLoanPayload {
//   loanId: string;
//   cancelReason: string;
// }

// export const cancelLoan = createAsyncThunk(
//   'loans/cancelLoan',
//   async ({ loanId, cancelReason }: CancelLoanPayload, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.auth.accessToken;
//       if (!token) return rejectWithValue('Authentication token is missing');
      
//       await axios.post(
//         `http://172.50.5.49:3000/loan/cancelLoan/${loanId}`,
//         { cancelReason },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       return { loanId };

//     } catch (error) {
//       return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to cancel loan');
//     }
//   }
// );


// // --- Loans Slice ---
// const loanAndAdvancesSlice = createSlice({
//   name: 'loans',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch Loans
//       .addCase(fetchLoans.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchLoans.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.loans = action.payload.loans;
//         state.totalItems = action.payload.totalItems;
//         state.totalPages = action.payload.totalPages;
//       })
//       .addCase(fetchLoans.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       })

//       // Update Loan
//       .addCase(updateLoan.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       // --- MODIFIED REDUCER CASE ---
//       // This reducer now uses the thunk's payload to manually update the state.
//       .addCase(updateLoan.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const { loanId, amountApp } = action.payload;
//         const index = state.loans.findIndex(loan => loan.id === loanId);
//         if (index !== -1) {
//             state.loans[index].approvedAmount = `₹ ${Number(amountApp).toLocaleString('en-IN')}`;
//             // Note: Staff notes are not typically stored in the list view, so we only update the visible amount.
//         }
//       })
//       .addCase(updateLoan.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       })

//       // Approve Loan
//       .addCase(approveLoan.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(approveLoan.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const index = state.loans.findIndex(loan => loan.id === action.payload.loanId);
//         if (index !== -1) {
//             state.loans[index].status = 'Approved';
//             state.loans[index].approvedAmount = `₹ ${Number(action.payload.amountApp).toLocaleString('en-IN')}`;
//             state.loans[index].installments = action.payload.installment;
//         }
//       })
//       .addCase(approveLoan.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       })

//       // Cancel Loan
//       .addCase(cancelLoan.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(cancelLoan.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const index = state.loans.findIndex(loan => loan.id === action.payload.loanId);
//         if (index !== -1) {
//             state.loans[index].status = 'Declined';
//         }
//       })
//       .addCase(cancelLoan.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       });
//   },
// });

// export default loanAndAdvancesSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// CHANGED: Import isAxiosError and the configured axios instance
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; // Adjust path if needed!
import type { RootState } from '../store';

// --- Type Definitions (No changes needed here) ---
export interface LoanAPIResponse {
  id: string;
  name: string;
  amountReq: string;
  status: string;
  amountApp: string;
  installment: string;
  balanced: string;
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

// --- Helper Function for Data Transformation (No changes needed here) ---
const transformApiLoan = (apiLoan: LoanAPIResponse): Loan => ({
  id: apiLoan.id,
  employeeName: apiLoan.name,
  requestedAmount: `₹ ${Number(apiLoan.amountReq).toLocaleString('en-IN')}`,
  status: (apiLoan.status.charAt(0).toUpperCase() + apiLoan.status.slice(1)) as Loan['status'],
  approvedAmount: `₹ ${Number(apiLoan.amountApp).toLocaleString('en-IN')}`,
  installments: apiLoan.installment,
  balance: `₹ ${Number(apiLoan.balanced).toLocaleString('en-IN')}`,
  requestDate: '25 Feb 2022',
  note: '',
  approvedBy: '',
  staffNote: ''
});


// --- UPDATED API Thunks ---

// 1. FETCH ALL LOANS
interface FetchLoansArgs {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    statuses?: string[];
}

export const fetchLoans = createAsyncThunk(
  'loans/fetchLoans',
  async (args: FetchLoansArgs = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, startDate, endDate, statuses } = args;
      // REMOVED: Manual token handling is no longer needed.
      
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (statuses && statuses.length > 0) {
        params.append('status', statuses.map(s => s.toLowerCase()).join(','));
      }

      // CHANGED: Use axiosInstance with a relative URL and no manual headers
      const response = await axiosInstance.get(`/loan/getAll?${params.toString()}`);
      
      const data: LoanAPIResponse[] = response.data;
      const totalCount = Number(response.headers['x-total-count'] || data.length);

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

// 2. UPDATE A LOAN (EDIT)
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
      // REMOVED: Manual token handling.

      // CHANGED: Use axiosInstance with a relative URL and no manual headers
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

// 3. APPROVE A LOAN
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
      // REMOVED: Manual token handling.

      // CHANGED: Use axiosInstance with a relative URL and no manual headers
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

// 4. CANCEL A LOAN
interface CancelLoanPayload {
  loanId: string;
  cancelReason: string;
}

export const cancelLoan = createAsyncThunk(
  'loans/cancelLoan',
  async ({ loanId, cancelReason }: CancelLoanPayload, { rejectWithValue }) => {
    try {
      // REMOVED: Manual token handling.
      
      // CHANGED: Use axiosInstance with a relative URL and no manual headers
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


// --- Loans Slice (No changes needed here) ---
const loanAndAdvancesSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Loans
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
      // Update Loan
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