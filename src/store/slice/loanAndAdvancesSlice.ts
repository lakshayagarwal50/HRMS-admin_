// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios'; // Using axios for easier request handling

// // --- Type Definitions ---
// // Matches the API response structure
// export interface LoanAPIResponse {
//   id: string;
//   name: string;
//   amountReq: string;
//   status: string; // API status is lowercase
//   amountApp: string;
//   installment: string;
//   balanced: string;
// }

// // Internal state representation (camelCase and correct types)
// export interface Loan {
//   id: string;
//   employeeName: string;
//   requestedAmount: string;
//   status: "Approved" | "Canceled" | "Pending" | "Paid" | "Declined";
//   approvedAmount: string;
//   installments: string;
//   balance: string;
//   // Assuming requestDate comes from somewhere else or is not in the API response
//   requestDate: string; 
// }

// interface LoansState {
//   loans: Loan[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
//   // For pagination if the API provides it
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

// // --- API Fetching Logic ---
// interface FetchLoansArgs {
//     page?: number;
//     limit?: number;
//     startDate?: string;
//     endDate?: string;
//     statuses?: string[]; // Array of statuses for the query param
// }

// export const fetchLoans = createAsyncThunk(
//   'loans/fetchLoans',
//   async (args: FetchLoansArgs = {}) => {
//     const { page = 1, limit = 10, startDate, endDate, statuses } = args;
    
//     // Construct the URL with query parameters
//     const params = new URLSearchParams({
//         page: String(page),
//         limit: String(limit),
//     });
//     if (startDate) params.append('startDate', startDate);
//     if (endDate) params.append('endDate', endDate);
//     if (statuses && statuses.length > 0) {
//         statuses.forEach(status => params.append('status', status.toLowerCase()));
//     }

//     const API_ENDPOINT = `http://172.50.5.49:3000/loan?${params.toString()}`;
    
//     const response = await axios.get(API_ENDPOINT);
    
//     // Assuming the API returns the data array directly
//     // and total count/pages in headers (e.g., 'X-Total-Count')
//     const data: LoanAPIResponse[] = response.data;
//     const totalCount = Number(response.headers['x-total-count'] || data.length);

//     // Transform API data to match our internal state structure
//     const transformedData: Loan[] = data.map(item => ({
//         id: item.id,
//         employeeName: item.name,
//         requestedAmount: `₹ ${Number(item.amountReq).toLocaleString('en-IN')}`,
//         // Capitalize status and handle different names
//         status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as Loan['status'],
//         approvedAmount: `₹ ${Number(item.amountApp).toLocaleString('en-IN')}`,
//         installments: item.installment,
//         balance: `₹ ${Number(item.balanced).toLocaleString('en-IN')}`,
//         requestDate: '25 Feb 2022', // Placeholder date
//     }));

//     return {
//         loans: transformedData,
//         totalItems: totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//     };
//   }
// );


// // --- Loans Slice ---
// const loanAndAdvancesSlice = createSlice({
//   name: 'loans',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchLoans.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchLoans.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.loans = action.payload.loans;
//         state.totalItems = action.payload.totalItems;
//         state.totalPages = action.payload.totalPages;
//       })
//       .addCase(fetchLoans.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message ?? 'Failed to fetch loans';
//       });
//   },
// });

// export default loanAndAdvancesSlice.reducer;
// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios, { isAxiosError } from 'axios';
// import type { RootState } from '../store';

// // --- Type Definitions ---
// // Matches the API response structure
// export interface LoanAPIResponse {
//   id: string;
//   name: string;
//   amountReq: string;
//   status: string; // API status is lowercase
//   amountApp: string;
//   installment: string;
//   balanced: string;
// }

// // Internal state representation (camelCase and correct types)
// export interface Loan {
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

// // --- API Fetching Logic ---
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
      
//       // Get token from state
//       const state = getState() as RootState;
//       const token = state.auth.token;
//       if (!token) {
//         return rejectWithValue('Authentication token is missing');
//       }

//       // Construct the URL with query parameters
//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(limit),
//       });
//       if (startDate) params.append('startDate', startDate);
//       if (endDate) params.append('endDate', endDate);
//       if (statuses && statuses.length > 0) {
//         statuses.forEach(status => params.append('status', status.toLowerCase()));
//       }

//       const API_ENDPOINT = `http://172.50.5.49:3000/loan?${params.toString()}`;
      
//       const response = await axios.get(API_ENDPOINT, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       // Assuming the API returns the data array directly
//       // and total count/pages in headers
//       const data: LoanAPIResponse[] = response.data;
//       const totalCount = Number(response.headers['x-total-count'] || data.length);

//       // Transform API data to match our internal state structure
//       const transformedData: Loan[] = data.map(item => ({
//         id: item.id,
//         employeeName: item.name,
//         requestedAmount: `₹ ${Number(item.amountReq).toLocaleString('en-IN')}`,
//         status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as Loan['status'],
//         approvedAmount: `₹ ${Number(item.amountApp).toLocaleString('en-IN')}`,
//         installments: item.installment,
//         balance: `₹ ${Number(item.balanced).toLocaleString('en-IN')}`,
//         requestDate: '25 Feb 2022', // Placeholder date
//       }));

//       return {
//         loans: transformedData,
//         totalItems: totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//       };
//     } catch (error: unknown) {
//       if (isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.message || 'Failed to fetch loans');
//       }
//       return rejectWithValue('An unknown error occurred');
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
//       });
//   },
// });

// export default loanAndAdvancesSlice.reducer;
// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios, { isAxiosError } from 'axios';
// import type { RootState } from '../store'; // Assuming your store file exports RootState

// // --- Type Definitions ---
// // Matches the API response structure
// export interface LoanAPIResponse {
//   id: string;
//   name: string;
//   amountReq: string;
//   status: string; // API status is lowercase
//   amountApp: string;
//   installment: string;
//   balanced: string;
// }

// // Internal state representation (camelCase and correct types)
// export interface Loan {
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

// // --- API Fetching Logic ---
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
      
//       // Get token from state - assuming you have an auth slice
//       const state = getState() as RootState;
//       const token = state.auth.token; // Make sure you have an auth slice with a token
//       if (!token) {
//         return rejectWithValue('Authentication token is missing');
//       }

//       // Construct the URL with query parameters
//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(limit),
//       });
//       if (startDate) params.append('startDate', startDate);
//       if (endDate) params.append('endDate', endDate);
      
//       // Join multiple statuses into a single comma-separated string
//       if (statuses && statuses.length > 0) {
//         params.append('status', statuses.map(s => s.toLowerCase()).join(','));
//       }

//       const API_ENDPOINT = `http://localhost:3000/loan?${params.toString()}`;
      
//       const response = await axios.get(API_ENDPOINT, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       const data: LoanAPIResponse[] = response.data;
//       const totalCount = Number(response.headers['x-total-count'] || data.length);

//       // Transform API data to match our internal state structure
//       const transformedData: Loan[] = data.map(item => ({
//         id: item.id,
//         employeeName: item.name,
//         requestedAmount: `₹ ${Number(item.amountReq).toLocaleString('en-IN')}`,
//         status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as Loan['status'],
//         approvedAmount: `₹ ${Number(item.amountApp).toLocaleString('en-IN')}`,
//         installments: item.installment,
//         balance: `₹ ${Number(item.balanced).toLocaleString('en-IN')}`,
//         requestDate: '25 Feb 2022', // Placeholder date
//       }));

//       return {
//         loans: transformedData,
//         totalItems: totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//       };
//     } catch (error: unknown) {
//       if (isAxiosError(error)) {
//         // Handle specific API errors (e.g., 401 Unauthorized)
//         return rejectWithValue(error.response?.data?.message || 'Failed to fetch loans');
//       }
//       // Handle other unknown errors
//       return rejectWithValue('An unknown error occurred');
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
//       .addCase(fetchLoans.pending, (state) => {
//         state.status = 'loading';
//         state.error = null; // Clear previous errors on new request
//       })
//       .addCase(fetchLoans.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.loans = action.payload.loans;
//         state.totalItems = action.payload.totalItems;
//         state.totalPages = action.payload.totalPages;
//       })
//       .addCase(fetchLoans.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string; // Get error message from rejectWithValue
//       });
//   },
// });

// export default loanAndAdvancesSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';
import type { RootState } from '../store';

// --- Type Definitions ---
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

// --- Helper Function for Data Transformation ---
const transformApiLoan = (apiLoan: LoanAPIResponse): Loan => ({
    id: apiLoan.id,
    employeeName: apiLoan.name,
    requestedAmount: `₹ ${Number(apiLoan.amountReq).toLocaleString('en-IN')}`,
    status: (apiLoan.status.charAt(0).toUpperCase() + apiLoan.status.slice(1)) as Loan['status'],
    approvedAmount: `₹ ${Number(apiLoan.amountApp).toLocaleString('en-IN')}`,
    installments: apiLoan.installment,
    balance: `₹ ${Number(apiLoan.balanced).toLocaleString('en-IN')}`,
    requestDate: '25 Feb 2022', // Placeholder date, adjust if API provides it
});


// --- API Thunks ---

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
  async (args: FetchLoansArgs = {}, { getState, rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, startDate, endDate, statuses } = args;
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token is missing');

      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (statuses && statuses.length > 0) {
        params.append('status', statuses.map(s => s.toLowerCase()).join(','));
      }

      const response = await axios.get(`http://localhost:3000/loan?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
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

// --- MODIFIED THUNK ---
// This thunk now returns its own payload on success instead of relying on the API response body.
export const updateLoan = createAsyncThunk(
  'loans/updateLoan',
  async (payload: UpdateLoanPayload, { getState, rejectWithValue }) => {
    try {
      const { loanId, amountApp, staffNote } = payload;
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token is missing');

      // The API call is made, but we don't need to process the response here.
      await axios.patch(
        `http://localhost:3000/loan/${loanId}`,
        { amountApp, staffNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // On success, we return the original payload to the reducer.
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
  async (payload: ApproveLoanPayload, { getState, rejectWithValue }) => {
    try {
      const { loanId, ...requestBody } = payload;
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token is missing');

      await axios.post(
        `http://localhost:3000/approvedLoan/${loanId}`,
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
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
  async ({ loanId, cancelReason }: CancelLoanPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token is missing');
      
      await axios.post(
        `http://localhost:3000/cancelLoan/${loanId}`,
        { cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { loanId };

    } catch (error) {
      return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to cancel loan');
    }
  }
);


// --- Loans Slice ---
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
      // --- MODIFIED REDUCER CASE ---
      // This reducer now uses the thunk's payload to manually update the state.
      .addCase(updateLoan.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { loanId, amountApp } = action.payload;
        const index = state.loans.findIndex(loan => loan.id === loanId);
        if (index !== -1) {
            state.loans[index].approvedAmount = `₹ ${Number(amountApp).toLocaleString('en-IN')}`;
            // Note: Staff notes are not typically stored in the list view, so we only update the visible amount.
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
