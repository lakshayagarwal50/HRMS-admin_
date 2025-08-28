import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; // Adjust the import path as needed
import { fetchEmployeeDetails } from './employeeSlice';

// --- INTERFACES ---

export interface PfDataPayload {
  employeePfEnable: boolean;
  pfNum: string;
  employeerPfEnable: boolean;
  uanNum: string;
  esiEnable: boolean;
  esiNum: string;
  professionalTax: boolean;
  labourWelfare: boolean;
}

interface ApiResponse {
  message: string;
}

interface PfState {
  submitting: boolean;
  error: string | null;
}

const initialState: PfState = {
  submitting: false,
  error: null,
};

// --- ASYNC THUNKS ---

export const addPfDetails = createAsyncThunk<
  ApiResponse,
  { employeeId: string; employeeCode: string; pfData: PfDataPayload },
  { rejectValue: string }
>(
  'pf/addDetails',
  async ({ employeeId, employeeCode,pfData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/employees/pf/${employeeId}`,
        pfData
      );
      // Refetch all employee details to update the UI with the new PF data
      dispatch(fetchEmployeeDetails(employeeCode));
      return response.data as ApiResponse;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to add PF details.');
      }
      return rejectWithValue('An unknown error occurred while adding PF details.');
    }
  }
);

export const updatePfDetails = createAsyncThunk<
  ApiResponse,
  { pfId: string; employeeCode: string; pfData: Partial<PfDataPayload> },
  { rejectValue: string }
>(
  'pf/updateDetails',
  async ({ pfId, employeeCode, pfData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/employees/pf/${pfId}`,
        pfData
      );
      // Refetch all employee details to show the updated PF data
      dispatch(fetchEmployeeDetails(employeeCode));
      return response.data as ApiResponse;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to update PF details.');
      }
      return rejectWithValue('An unknown error occurred while updating PF details.');
    }
  }
);

// --- SLICE DEFINITION ---

const pfSlice = createSlice({
  name: 'pf',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for adding PF details
      .addCase(addPfDetails.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(addPfDetails.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(addPfDetails.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      // Cases for updating PF details
      .addCase(updatePfDetails.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updatePfDetails.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updatePfDetails.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export default pfSlice.reducer;