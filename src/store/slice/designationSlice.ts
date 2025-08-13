import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';

// --- CONSTANTS ---
const API_BASE_URL = 'http://localhost:3000/api/designations/';

// --- HELPER FUNCTION ---
/**
 * Retrieves the Firebase ID token from local storage.
 * @returns {string | null} The token or null if not found.
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('token'); // Make sure the key matches what you use in your auth logic
};


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
  const token = getAuthToken();
  if (!token) {
    return rejectWithValue('Authentication token not found.');
  }
  try {
    const response = await axios.get(`${API_BASE_URL}get`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as Designation[];
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch designations');
    }
    return rejectWithValue('An unknown error occurred');
  }
});

/**
 * Adds a new designation via the API.
 */
export const addDesignation = createAsyncThunk('designations/addDesignation', async (newDesignation: NewDesignation, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }
    const apiRequestBody = {
      designationName: newDesignation.name,
      code: newDesignation.code,
      description: newDesignation.description,
      department: newDesignation.department,
      status: newDesignation.status,
    };
    try {
      const response = await axios.post(`${API_BASE_URL}create`, apiRequestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const createdDesignation: Designation = {
        ...newDesignation,
        id: response.data.id,
        createdBy: 'current-user-id', 
        createdAt: new Date().toISOString(),
      };
      return createdDesignation;
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add designation');
        }
        return rejectWithValue('An unknown error occurred');
    }
  }
);

/**
 * Updates an existing designation, including its status.
 */
export const updateDesignation = createAsyncThunk('designations/updateDesignation', async (designation: Designation, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }
    try {
      const { id, name, code, description, department, status } = designation;
      
      const apiRequestBody = {
        designationName: name,
        code,
        description,
        department,
        status,
      };

      await axios.put(`${API_BASE_URL}update/${id}`, apiRequestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return designation;
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update designation');
        }
        return rejectWithValue('An unknown error occurred');
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
