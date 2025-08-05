import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// --- CONSTANTS ---
const API_URL = 'http://172.50.5.116:3000/api/departments/';
// WARNING: Storing tokens directly in code is insecure and will expire. 
// This should be managed through an authentication context or a more secure mechanism.
const FIREBASE_ID_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1MWRkZTkzMmViYWNkODhhZmIwMDM3YmZlZDhmNjJiMDdmMDg2NmIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU3VwZXJBZG1pbiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ocm1zLTI5M2FiIiwiYXVkIjoiaHJtcy0yOTNhYiIsImF1dGhfdGltZSI6MTc1NDI5OTE5MiwidXNlcl9pZCI6IlN0Vjd0RU1heUljZzVndnU1bTRtYjNVcUhTNzIiLCJzdWIiOiJTdFY3dEVNYXlJY2c1Z3Z1NW00bWIzVXFIUzcyIiwiaWF0IjoxNzU0Mjk5MTkyLCJleHAiOjE3NTQzMDI3OTIsImVtYWlsIjoiYWRtaW5Ac3VwZXJhZG1pbi5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYWRtaW5Ac3VwZXJhZG1pbi5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.grNactzU7iYau-_MCKf3E2PZYHkmGR7wcNGn2s02ckE3LXriRy1_RX8cNPtSKXO7B1UO3bZRASpzDo6fPSlrLczkciTv9SXlouxIkBAKeOn4tmTAzl1Wo3HpbatwA8NBKQ8GCXwc7RA12ENhgPucoYs0YZCV4_PL-2vLV-AsuhgWU8DQxS4AA_jdVOcRC625zEo5FoJB54RKhBXttlKZQ_M3x8am0J7ZaR7l2LxWB2Lw1aLbeAbsFfXtFWrtu5-Xe_Fq2D0xdLk0io8TvHXrCj8kxufwCfOfXsRjKLcgzXJ0sMEH-iGw2TwfU8SHq0FQcW1MvT7kQSzClFSYYvfFxw';

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
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
  });
  return response.data as Department[];
});

export const addDepartment = createAsyncThunk('departments/addDepartment', async (newDepartment: NewDepartment) => {
    const response = await axios.post(API_URL, newDepartment, {
      headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
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
    const { id, ...data } = department;
    await axios.put(`${API_URL}${id}`, data, {
      headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
    });
    return department;
  }
);

/**
 * DEACTIVATE: Uses the DELETE endpoint to mark a department as 'inactive'.
 */
export const deactivateDepartment = createAsyncThunk('departments/deactivateDepartment', async (department: Department) => {
    await axios.delete(`${API_URL}${department.id}`, {
      headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
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
