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

export type NewSalaryStructure = {
  groupName: string;
  description: string;
  code: string;
};

export type UpdateSalaryStructurePayload = { id: string } & Partial<NewSalaryStructure>;


export interface SalaryStructureState {
  data: SalaryStructure[];
  // 'mutating' can be used to distinguish between fetching data and changing it
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'mutating';
  error: string | null;
}

// --- INITIAL STATE ---
const initialState: SalaryStructureState = {
  data: [],
  status: 'idle',
  error: null,
};

// --- ASYNCHRONOUS THUNKS ---

// GET /payslip/structure
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

// POST /payslip/structure
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

// PATCH /payslip/structure/:id
export const updateSalaryStructure = createAsyncThunk(
  'salaryStructures/update',
  async (payload: UpdateSalaryStructurePayload, { rejectWithValue }) => {
    try {
      const { id, ...data } = payload;
      const response = await axiosInstance.patch(`${API_BASE_URL}/${id}`, data);
      return response.data as SalaryStructure;
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update structure');
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// DELETE /payslip/structure/:id  <- CORRECTED ENDPOINT
export const deleteSalaryStructure = createAsyncThunk(
  'salaryStructures/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      // ✅ Corrected: Removed the extra '/delete' from the URL
      await axiosInstance.delete(`${API_BASE_URL}/${id}`);
      return id; // Return the ID on success for filtering in the reducer
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
    // Define a matcher for pending mutation actions (add, update, delete)
    const isMutationPending = (action: PayloadAction<unknown>) =>
      action.type.startsWith('salaryStructures/') && action.type.endsWith('/pending');

    // Define a matcher for rejected mutation actions
    const isMutationRejected = (action: PayloadAction<unknown>) =>
      action.type.startsWith('salaryStructures/') && action.type.endsWith('/rejected');

    builder
      // --- Fetch Cases ---
      .addCase(fetchSalaryStructures.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSalaryStructures.fulfilled, (state, action: PayloadAction<SalaryStructure[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      
      // --- Add Cases ---
      .addCase(addSalaryStructure.fulfilled, (state, action: PayloadAction<SalaryStructure>) => {
        state.status = 'succeeded';
        state.data.unshift(action.payload);
      })

      // --- Update Cases ---
      .addCase(updateSalaryStructure.fulfilled, (state, action: PayloadAction<SalaryStructure>) => {
        state.status = 'succeeded';
        const index = state.data.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      
      // --- Delete Cases ---
      .addCase(deleteSalaryStructure.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.data = state.data.filter(s => s.id !== action.payload);
      })

      // --- Shared Cases for Mutations using matchers ---
      .addMatcher(isMutationPending, (state) => {
        state.status = 'mutating'; // Use a specific status for mutations
        state.error = null;
      })
      .addMatcher(isMutationRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default salaryStructureSlice.reducer;