import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { type PayloadAction} from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';
import type { RootState } from '../store';

// 🔧 API URL for designations
const API_URL = 'http://172.50.5.116:3000/api/designations/get';

// 🧩 Designation Type
export interface Designation {
  id: string;
  name: string;
  code: string;
  description: string;
  department: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
}

// 🧩 Employee Designations State Type
export interface EmployeeDesignationsState {
  items: Designation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// 🧩 Initial State
const initialState: EmployeeDesignationsState = {
  items: [],
  status: 'idle',
  error: null,
};

// 🧩 Async Thunk to Fetch Designations by Department
export const fetchEmployeeDesignations = createAsyncThunk(
  'employeeDesignations/fetchEmployeeDesignations',
  async (department: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }
      const response = await axios.get(API_URL, {
        params: { department },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as Designation[];
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch designations');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// 🧩 Employee Designation Slice
const employeeDesignationSlice = createSlice({
  name: 'employeeDesignations',
  initialState,
  reducers: {
    resetEmployeeDesignations: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeDesignations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmployeeDesignations.fulfilled, (state, action: PayloadAction<Designation[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEmployeeDesignations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetEmployeeDesignations } = employeeDesignationSlice.actions;
export default employeeDesignationSlice.reducer;