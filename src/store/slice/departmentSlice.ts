import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- Base URL for the API endpoint ---
const API_BASE_URL = '/api/departments/';

// --- TYPE DEFINITIONS ---
export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
}

export type NewDepartment = Omit<Department, 'id' | 'createdBy' | 'createdAt' | 'status'>;
export type UpdateDepartmentPayload = { id: string } & Partial<Omit<Department, 'id' | 'createdBy' | 'createdAt'>>;


export interface DepartmentsState {
  items: Department[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DepartmentsState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- ASYNCHRONOUS THUNKS ---

export const fetchDepartments = createAsyncThunk(
    'departments/fetchDepartments', 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_BASE_URL);
            return response.data as Department[];
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

export const addDepartment = createAsyncThunk(
    'departments/addDepartment', 
    async (newDepartment: NewDepartment, { dispatch, rejectWithValue }) => {
        try {
            const payload = { ...newDepartment, status: 'active' };
            await axiosInstance.post(API_BASE_URL, payload);
            // *** THE FIX ***: After adding, re-fetch the entire list.
            dispatch(fetchDepartments());
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add department');
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

export const updateDepartment = createAsyncThunk(
    'departments/updateDepartment', 
    async (department: UpdateDepartmentPayload, { dispatch, rejectWithValue }) => {
        try {
            const { id, ...data } = department;
            await axiosInstance.put(`${API_BASE_URL}${id}`, data);
            // *** THE FIX ***: After updating, re-fetch the entire list.
            dispatch(fetchDepartments());
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update department');
            return rejectWithValue('An unknown error occurred.');
        }
    }
);


// --- SLICE DEFINITION ---
const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      // We no longer need to manually add/update the state here, as the fetch action handles it.
      // We can just set the status to 'loading' to provide immediate UI feedback.
      .addCase(addDepartment.fulfilled, (state) => {
        state.status = 'loading'; 
      })
      .addCase(updateDepartment.fulfilled, (state) => {
        state.status = 'loading';
      })
      .addMatcher(isPending(fetchDepartments, addDepartment, updateDepartment), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchDepartments, addDepartment, updateDepartment), (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export default departmentSlice.reducer;

