import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
// Assuming you have a configured axios instance in your services folder
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
export type UpdateDepartmentPayload = { id: string } & Partial<NewDepartment>;


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
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
            }
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

export const addDepartment = createAsyncThunk(
    'departments/addDepartment', 
    async (newDepartment: NewDepartment, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(API_BASE_URL, newDepartment);
            // Assuming the API returns the newly created department object
            return response.data as Department;
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to add department');
            }
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

export const updateDepartment = createAsyncThunk(
    'departments/updateDepartment', 
    async (department: UpdateDepartmentPayload, { rejectWithValue }) => {
        try {
            const { id, ...data } = department;
            const response = await axiosInstance.put(`${API_BASE_URL}${id}`, data);
             // Assuming the API returns the updated department object
            return response.data as Department;
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to update department');
            }
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

export const deactivateDepartment = createAsyncThunk(
    'departments/deactivateDepartment', 
    async (id: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${API_BASE_URL}${id}`);
            return id; // Return the ID of the deactivated department
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to deactivate department');
            }
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
      // Cases for Fetching Data
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Case for Adding a Department
      .addCase(addDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        state.items.push(action.payload);
      })
      
      // Case for Updating a Department
      .addCase(updateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        const index = state.items.findIndex((dep) => dep.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // Case for Deactivating a Department
      .addCase(deactivateDepartment.fulfilled, (state, action: PayloadAction<string>) => {
        const index = state.items.findIndex((dep) => dep.id === action.payload);
        if (index !== -1) {
          // Update the status of the deactivated department
          state.items[index].status = 'inactive';
        }
      });
  },
});

export default departmentSlice.reducer;
