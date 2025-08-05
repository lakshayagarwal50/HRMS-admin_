// src/store/slice/designationSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// --- CONSTANTS ---
const API_BASE_URL = 'http://172.50.5.116:3000/api/designations/';
// WARNING: Storing tokens directly in code is insecure and will expire.
const FIREBASE_ID_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1MWRkZTkzMmViYWNkODhhZmIwMDM3YmZlZDhmNjJiMDdmMDg2NmIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU3VwZXJBZG1pbiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ocm1zLTI5M2FiIiwiYXVkIjoiaHJtcy0yOTNhYiIsImF1dGhfdGltZSI6MTc1NDI5OTE5MiwidXNlcl9pZCI6IlN0Vjd0RU1heUljZzVndnU1bTRtYjNVcUhTNzIiLCJzdWIiOiJTdFY3dEVNYXlJY2c1Z3Z1NW00bWIzVXFIUzcyIiwiaWF0IjoxNzU0Mjk5MTkyLCJleHAiOjE3NTQzMDI3OTIsImVtYWlsIjoiYWRtaW5Ac3VwZXJhZG1pbi5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYWRtaW5Ac3VwZXJhZG1pbi5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.grNactzU7iYau-_MCKf3E2PZYHkmGR7wcNGn2s02ckE3LXriRy1_RX8cNPtSKXO7B1UO3bZRASpzDo6fPSlrLczkciTv9SXlouxIkBAKeOn4tmTAzl1Wo3HpbatwA8NBKQ8GCXwc7RA12ENhgPucoYs0YZCV4_PL-2vLV-AsuhgWU8DQxS4AA_jdVOcRC625zEo5FoJB54RKhBXttlKZQ_M3x8am0J7ZaR7l2LxWB2Lw1aLbeAbsFfXtFWrtu5-Xe_Fq2D0xdLk0io8TvHXrCj8kxufwCfOfXsRjKLcgzXJ0sMEH-iGw2TwfU8SHq0FQcW1MvT7kQSzClFSYYvfFxw';

// --- TYPE DEFINITIONS ---
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

export type NewDesignation = Omit<Designation, 'id' | 'createdBy' | 'createdAt'>;

export interface DesignationsState {
  items: Designation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DesignationsState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---

/**
 * Fetches all designations from the API.
 */
export const fetchDesignations = createAsyncThunk('designations/fetchDesignations', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}get`, {
      headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
    });
    return response.data as Designation[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch designations');
  }
});

/**
 * Adds a new designation via the API.
 */
export const addDesignation = createAsyncThunk('designations/addDesignation', async (newDesignation: NewDesignation, { rejectWithValue }) => {
    const apiRequestBody = {
      designationName: newDesignation.name,
      code: newDesignation.code,
      description: newDesignation.description,
      department: newDesignation.department,
      status: newDesignation.status,
    };
    try {
      const response = await axios.post(`${API_BASE_URL}create`, apiRequestBody, {
        headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
      });
      const createdDesignation: Designation = {
        ...newDesignation,
        id: response.data.id,
        createdBy: 'current-user-id', 
        createdAt: new Date().toISOString(),
      };
      return createdDesignation;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add designation');
    }
  }
);

/**
 * Updates an existing designation, including its status.
 */
export const updateDesignation = createAsyncThunk('designations/updateDesignation', async (designation: Designation, { rejectWithValue }) => {
    try {
      // Destructure all fields that need to be sent, including status
      const { id, name, code, description, department, status } = designation;
      
      // Create the request body for the API
      const apiRequestBody = {
        designationName: name,
        code,
        description,
        department,
        status, // FIX: Include status in the request body
      };

      await axios.put(`${API_BASE_URL}update/${id}`, apiRequestBody, {
        headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
      });
      
      // Return the full designation object to update the state
      return designation;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update designation');
    }
  }
);


// --- SLICE DEFINITION ---
const designationSlice = createSlice({
  name: 'designations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Handle all API call states (pending, fulfilled, rejected) for robustness ---

      // Fetch Designations
      .addCase(fetchDesignations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action: PayloadAction<Designation[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Add Designation
      .addCase(addDesignation.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addDesignation.fulfilled, (state, action: PayloadAction<Designation>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addDesignation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Update Designation
      .addCase(updateDesignation.pending, (state) => {
        // You could set a specific loading state for updates if needed
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateDesignation.fulfilled, (state, action: PayloadAction<Designation>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default designationSlice.reducer;
