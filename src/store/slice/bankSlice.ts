// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios, { isAxiosError } from 'axios';
// import { fetchEmployeeDetails } from './employeeSlice';

// const API_BASE_URL = 'http://172.50.5.116:3000/employees';



// const getAuthToken = (): string | null => {
//   return localStorage.getItem('token'); 
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


// src/store/slice/bankSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; // Import the centralized axios instance
import { fetchEmployeeDetails } from './employeeSlice';

// The base path for employee-related endpoints
const API_BASE_PATH = '/employees';

// --- TYPE DEFINITIONS ---
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

// --- ASYNC THUNKS ---

/**
 * @description Thunk to add bank details for an employee.
 * It uses the centralized axiosInstance which handles auth headers and token refresh.
 */
export const addBankDetails = createAsyncThunk<
  ApiResponse,
  { employeeId: string; empCode: string; bankData: AddBankDetailsPayload },
  { rejectValue: string }
>(
  'bank/addDetails',
  async ({ employeeId, empCode, bankData }, { dispatch, rejectWithValue }) => {
    try {
      // Use axiosInstance; no need to manually set auth headers.
      const response = await axiosInstance.post(
        `${API_BASE_PATH}/bank/${employeeId}`,
        bankData
      );
      
      // On success, refetch the main employee details to update the UI.
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

/**
 * @description Thunk to update existing bank details.
 * It uses the centralized axiosInstance.
 */
export const updateBankDetails = createAsyncThunk<
  ApiResponse,
  { bankDetailId: string; empCode: string; bankData: UpdateBankDetailsPayload },
  { rejectValue: string }
>(
  'bank/updateDetails',
  async ({ bankDetailId, empCode, bankData }, { dispatch, rejectWithValue }) => {
    try {
      // Use axiosInstance; the interceptor handles the Bearer token.
      const response = await axiosInstance.patch(
        `${API_BASE_PATH}/bank/${bankDetailId}`,
        bankData
      );

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

// --- SLICE DEFINITION ---
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