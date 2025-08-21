import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- Base URL for the API endpoints ---
const API_BASE_URL = '/payslip/structure';

// --- TYPE DEFINITIONS ---
export interface SalaryStructure {
  id: string;
  groupName: string;
  code: string;
  salaryComponent: string[];
  isDeleted: boolean;
  description: string;
}

// Type for creating a new structure, matching the API request body
export type NewSalaryStructure = {
  groupName: string;
  description: string;
  code: string;
};

export type UpdateSalaryStructurePayload = { id: string } & Partial<NewSalaryStructure>;


export interface SalaryStructureState {
  data: SalaryStructure[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// --- INITIAL STATE ---
const initialState: SalaryStructureState = {
  data: [],
  status: 'idle',
  error: null,
};

// --- ASYNCHRONOUS THUNKS ---

export const fetchSalaryStructures = createAsyncThunk(
  'salaryStructures/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_BASE_URL);
      return response.data as SalaryStructure[];
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch structures');
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const addSalaryStructure = createAsyncThunk(
  'salaryStructures/add',
  async (newStructure: NewSalaryStructure, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_BASE_URL, newStructure);
      return response.data as SalaryStructure;
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add structure');
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const updateSalaryStructure = createAsyncThunk(
  'salaryStructures/update',
  async (payload: UpdateSalaryStructurePayload, { rejectWithValue }) => {
    try {
      const { id, ...data } = payload;
      // Corrected: Use PATCH and the correct endpoint
      const response = await axiosInstance.patch(`${API_BASE_URL}/${id}`, data);
      // The API returns the full updated object, which we'll use to update the state
      return response.data as SalaryStructure;
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update structure');
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const deleteSalaryStructure = createAsyncThunk(
  'salaryStructures/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/delete/${id}`);
      return id;
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete structure');
      return rejectWithValue('An unknown error occurred.');
    }
  }
);


// --- THE SLICE ---
const salaryStructureSlice = createSlice({
  name: 'salaryStructures',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSalaryStructures.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchSalaryStructures.fulfilled, (state, action: PayloadAction<SalaryStructure[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSalaryStructures.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add
      .addCase(addSalaryStructure.fulfilled, (state, action: PayloadAction<SalaryStructure>) => {
        state.data.unshift(action.payload);
      })
      // Update
      .addCase(updateSalaryStructure.fulfilled, (state, action: PayloadAction<SalaryStructure>) => {
        const index = state.data.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          // Replace the old item with the full updated object from the API
          state.data[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteSalaryStructure.fulfilled, (state, action: PayloadAction<string>) => {
        state.data = state.data.filter(s => s.id !== action.payload);
      });
  },
});

export default salaryStructureSlice.reducer;
