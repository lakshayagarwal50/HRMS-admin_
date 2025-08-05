

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchEmployeeDetails } from './employeeSlice';

// --- INTERFACES for Bank Details ---
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

// For POST (Creating new details)
export const addBankDetails = createAsyncThunk<
  ApiResponse,
  { employeeId: string; empCode: string; bankData: AddBankDetailsPayload },
  { rejectValue: string }
>(
  'bank/addDetails',
  async ({ employeeId, empCode, bankData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/employees/bank/${employeeId}`,
        bankData
      );
      dispatch(fetchEmployeeDetails(empCode));
      return response.data as ApiResponse;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to add bank details.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// For PATCH (Updating existing details)
export const updateBankDetails = createAsyncThunk<
  ApiResponse,
  { bankDetailId: string; empCode: string; bankData: UpdateBankDetailsPayload },
  { rejectValue: string }
>(
  'bank/updateDetails',
  async ({ bankDetailId, empCode, bankData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/employees/bank/${bankDetailId}`,
        bankData
      );
      dispatch(fetchEmployeeDetails(empCode));
      return response.data as ApiResponse;
    } catch (error) {
       if (axios.isAxiosError(error) && error.response) {
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
      .addCase(addBankDetails.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(addBankDetails.fulfilled, (state) => { state.submitting = false; })
      .addCase(addBankDetails.rejected, (state, action) => { state.submitting = false; state.error = action.payload as string; })
      // Cases for updating
      .addCase(updateBankDetails.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(updateBankDetails.fulfilled, (state) => { state.submitting = false; })
      .addCase(updateBankDetails.rejected, (state, action) => { state.submitting = false; state.error = action.payload as string; });
  },
});

export const { clearBankError } = bankSlice.actions;
export default bankSlice.reducer;