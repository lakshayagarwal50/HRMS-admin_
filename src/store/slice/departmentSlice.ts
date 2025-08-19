import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// --- CONSTANTS ---
const API_URL = 'http://172.50.5.116:3000/api/departments/';
// WARNING: Storing tokens directly in code is insecure and will expire. 
// This should be managed through an authentication context or a more secure mechanism.
const getAuthToken = (): string | null => {
  return localStorage.getItem('token'); // Make sure the key matches what you use in your auth logic
};
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

export type NewDepartment = Omit<Department, 'id' | 'createdBy' | 'createdAt'>;

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

export const fetchDepartments = createAsyncThunk('departments/fetchDepartments', async () => {
   const token = getAuthToken();
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as Department[];
});

export const addDepartment = createAsyncThunk('departments/addDepartment', async (newDepartment: NewDepartment) => {
    const token = getAuthToken();
    const response = await axios.post(API_URL, newDepartment, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { id } = response.data;
    const createdDepartment: Department = {
      ...newDepartment,
      id: id,
      createdBy: 'current-user-id',
      createdAt: new Date().toISOString(),
    };
    return createdDepartment;
  }
);

export const updateDepartment = createAsyncThunk('departments/updateDepartment', async (department: Department) => {
  const token = getAuthToken();
    const { id, ...data } = department;
    await axios.put(`${API_URL}${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return department;
  }
);

/**
 * DEACTIVATE: Uses the DELETE endpoint to mark a department as 'inactive'.
 */
export const deactivateDepartment = createAsyncThunk('departments/deactivateDepartment', async (department: Department) => {
    const token = getAuthToken();
    await axios.delete(`${API_URL}${department.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Return a copy of the department with the status changed to 'inactive'
    return { ...department, status: 'inactive' as const };
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
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch departments';
      })

      // Case for Adding a Department
      .addCase(addDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        state.items.push(action.payload);
      })
      
      // Case for Updating a Department (from the edit form)
      .addCase(updateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        const index = state.items.findIndex((dep) => dep.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // Case for Deactivating a Department
      .addCase(deactivateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        const index = state.items.findIndex((dep) => dep.id === action.payload.id);
        if (index !== -1) {
          // Replace the item with the updated one (status is now 'inactive')
          state.items[index] = action.payload;
        }
      });
  },
});

export default departmentSlice.reducer;
