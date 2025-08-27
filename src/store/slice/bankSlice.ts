// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios, { isAxiosError } from 'axios';
// import { fetchEmployeeDetails } from './employeeSlice';

// const API_BASE_URL = 'http://172.50.5.49:3000/employees';



// const getAuthToken = (): string | null => {
//   return localStorage.getItem('accessToken'); 
// };


// export interface BankDetails {
//   id?: string;
//   bankName: string | null;
//   accountName: string | null;
//   accountNum: string | null;
//   accountType: string | null;
//   branchName: string | null;
//   ifscCode: string | null;
// }

// type AddBankDetailsPayload = Omit<BankDetails, 'id'>;
// type UpdateBankDetailsPayload = Partial<AddBankDetailsPayload>;

// interface ApiResponse {
//   bankDetailId?: string;
//   message: string;
// }

// interface BankState {
//   submitting: boolean;
//   error: string | null;
// }

// const initialState: BankState = {
//   submitting: false,
//   error: null,
// };


// export const addBankDetails = createAsyncThunk<
//   ApiResponse,
//   { employeeId: string; empCode: string; bankData: AddBankDetailsPayload },
//   { rejectValue: string }
// >(
//   'bank/addDetails',
//   async ({ employeeId, empCode, bankData }, { dispatch, rejectWithValue }) => {
//     const token = getAuthToken();
//     if (!token) {
//       return rejectWithValue('Authentication token not found.');
//     }

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/bank/${employeeId}`,
//         bankData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       dispatch(fetchEmployeeDetails(empCode));
//       return response.data as ApiResponse;
//     } catch (error: unknown) {
//       if (isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || 'Failed to add bank details.');
//       }
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );

// export const updateBankDetails = createAsyncThunk<
//   ApiResponse,
//   { bankDetailId: string; empCode: string; bankData: UpdateBankDetailsPayload },
//   { rejectValue: string }
// >(
//   'bank/updateDetails',
//   async ({ bankDetailId, empCode, bankData }, { dispatch, rejectWithValue }) => {
//     const token = getAuthToken();
//     if (!token) {
//       return rejectWithValue('Authentication token not found.');
//     }

//     try {
//       const response = await axios.patch(
//         `${API_BASE_URL}/bank/${bankDetailId}`,
//         bankData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       dispatch(fetchEmployeeDetails(empCode));
//       return response.data as ApiResponse;
//     } catch (error: unknown) {
//       if (isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || 'Failed to update bank details.');
//       }
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );

// // --- SLICE DEFINITION ---
// const bankSlice = createSlice({
//   name: 'bank',
//   initialState,
//   reducers: {
//     clearBankError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Cases for adding
//       .addCase(addBankDetails.pending, (state) => {
//         state.submitting = true;
//         state.error = null;
//       })
//       .addCase(addBankDetails.fulfilled, (state) => {
//         state.submitting = false;
//       })
//       .addCase(addBankDetails.rejected, (state, action) => {
//         state.submitting = false;
//         state.error = action.payload as string;
//       })
//       // Cases for updating
//       .addCase(updateBankDetails.pending, (state) => {
//         state.submitting = true;
//         state.error = null;
//       })
//       .addCase(updateBankDetails.fulfilled, (state) => {
//         state.submitting = false;
//       })
//       .addCase(updateBankDetails.rejected, (state, action) => {
//         state.submitting = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearBankError } = bankSlice.actions;
// export default bankSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// 1. Import isAxiosError from the main axios library
import { isAxiosError } from 'axios';
// 2. Import your configured axios instance
import { axiosInstance } from '../../services'; // Adjust this path if needed!
import { fetchEmployeeDetails } from './employeeSlice';

// --- REMOVED ---
// API_BASE_URL and getAuthToken are no longer needed.

// --- Interfaces (No changes needed here) ---
export interface BankDetails {
  id?: string;
  bankName: string | null;
  accountName: string | null;
  accountNum: string | null;
  accountType: string | null;
  branchName: string | null;
  ifscCode: string | null;
}

type AddBankDetailsPayload = Omit<BankDetails, 'id'>;
type UpdateBankDetailsPayload = Partial<AddBankDetailsPayload>;

interface ApiResponse {
  bankDetailId?: string;
  message: string;
}

interface BankState {
  submitting: boolean;
  error: string | null;
}

const initialState: BankState = {
  submitting: false,
  error: null,
};

// --- UPDATED ASYNC THUNKS ---

export const addBankDetails = createAsyncThunk<
  ApiResponse,
  { employeeId: string; empCode: string; bankData: AddBankDetailsPayload },
  { rejectValue: string }
>(
  'bank/addDetails',
  async ({ employeeId, empCode, bankData }, { dispatch, rejectWithValue }) => {
    try {
      // CHANGED: Use axiosInstance, relative URL, and no manual headers
      const response = await axiosInstance.post(
        `/employees/bank/${employeeId}`,
        bankData
      );
      // This dispatch will refetch the employee details to show the new bank info
      dispatch(fetchEmployeeDetails(empCode));
      return response.data as ApiResponse;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to add bank details.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const updateBankDetails = createAsyncThunk<
  ApiResponse,
  { bankDetailId: string; empCode: string; bankData: UpdateBankDetailsPayload },
  { rejectValue: string }
>(
  'bank/updateDetails',
  async ({ bankDetailId, empCode, bankData }, { dispatch, rejectWithValue }) => {
    try {
      // CHANGED: Use axiosInstance, relative URL, and no manual headers
      const response = await axiosInstance.patch(
        `/employees/bank/${bankDetailId}`,
        bankData
      );
      // This dispatch will refetch the employee details to show the updated bank info
      dispatch(fetchEmployeeDetails(empCode));
      return response.data as ApiResponse;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to update bank details.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// --- SLICE DEFINITION (No changes needed here) ---
const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    clearBankError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases for adding
      .addCase(addBankDetails.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(addBankDetails.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(addBankDetails.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      // Cases for updating
      .addCase(updateBankDetails.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateBankDetails.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateBankDetails.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBankError } = bankSlice.actions;
export default bankSlice.reducer;