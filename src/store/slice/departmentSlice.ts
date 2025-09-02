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

// --- ASYNC THUNKS ---

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
    async (newDepartment: NewDepartment, { rejectWithValue }) => {
        try {
            const payload = { ...newDepartment, status: 'active' };
            const response = await axiosInstance.post(API_BASE_URL, payload);
            return response.data as Department;
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
            
            // *** THE FIX ***
            // After the update is successful, dispatch the action to re-fetch the entire list.
            // This guarantees the UI will always show the latest data.
            dispatch(fetchDepartments());

            // We don't need to return data here because the fetch action will handle it.
            return;
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
      .addCase(addDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        state.items.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(updateDepartment.fulfilled, (state) => {
        // The state will be updated by the `fetchDepartments` action,
        // so we just set the status to 'loading' to show feedback.
        state.status = 'loading';
      })
      .addMatcher(isPending(fetchDepartments, addDepartment), (state) => {
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

