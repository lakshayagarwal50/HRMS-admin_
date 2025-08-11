import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';

// --- CONSTANTS & HELPERS ---
// Note the typo in "holidayConfiguraion" to match your API endpoint
const API_BASE_URL = 'http://localhost:3000/api/holidayConfiguraion/';
const getAuthToken = (): string | null => localStorage.getItem('token'); // A better way to get tokens

// --- TYPE DEFINITIONS ---
// This interface matches the structure of the data from your GET API
export interface HolidayConfiguration {
  id: string;
  groupName: string;
  code: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

// Defines the shape of the data needed to create a new configuration
export type NewHolidayConfiguration = Omit<HolidayConfiguration, 'id' | 'createdBy' | 'createdAt'>;

// Defines the structure of the Redux slice state
export interface HolidayConfigsState {
  items: HolidayConfiguration[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HolidayConfigsState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---

/**
 * FETCH: Fetches all holiday configurations from the server.
 */
export const fetchHolidayConfigurations = createAsyncThunk('holidayConfigs/fetch', async (_, { rejectWithValue }) => {
  const token = getAuthToken();
  if (!token) return rejectWithValue('Authentication token not found.');
  try {
    const response = await axios.get(`${API_BASE_URL}get`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as HolidayConfiguration[];
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch configurations');
    return rejectWithValue('An unknown error occurred.');
  }
});

/**
 * ADD: Creates a new holiday configuration on the server.
 */
export const addHolidayConfiguration = createAsyncThunk('holidayConfigs/add', async (newConfig: NewHolidayConfiguration, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Authentication token not found.');
    
    // Map UI data shape to API body shape ("groupName" -> "name")
    const apiRequestBody = {
        name: newConfig.groupName,
        code: newConfig.code,
        description: newConfig.description,
    };

    try {
        const response = await axios.post(`${API_BASE_URL}create`, apiRequestBody, { headers: { Authorization: `Bearer ${token}` } });
        // Construct the full object for the UI with the ID from the response
        return { 
            ...newConfig, 
            id: response.data.id,
            createdBy: 'current-user-id', // Placeholder
            createdAt: new Date().toISOString(), // Placeholder
        } as HolidayConfiguration;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add configuration');
        return rejectWithValue('An unknown error occurred.');
    }
});

/**
 * UPDATE: Updates an existing holiday configuration on the server.
 */
export const updateHolidayConfiguration = createAsyncThunk('holidayConfigs/update', async (config: HolidayConfiguration, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Authentication token not found.');

    // Map UI data shape to API body shape ("groupName" -> "name")
    const apiRequestBody = {
        name: config.groupName,
        code: config.code,
        description: config.description,
    };

    try {
        await axios.put(`${API_BASE_URL}update/${config.id}`, apiRequestBody, { headers: { Authorization: `Bearer ${token}` } });
        // Return the original updated object to the reducer
        return config;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update configuration');
        return rejectWithValue('An unknown error occurred.');
    }
});

/**
 * DELETE: Deletes a holiday configuration from the server.
 */
export const deleteHolidayConfiguration = createAsyncThunk('holidayConfigs/delete', async (id: string, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Authentication token not found.');
    try {
        await axios.delete(`${API_BASE_URL}delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        // Return the ID of the deleted item
        return id;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete configuration');
        return rejectWithValue('An unknown error occurred.');
    }
});


// --- SLICE DEFINITION ---
const holidayConfigurationSlice = createSlice({
  name: 'holidayConfigurations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fulfilled cases for each thunk
      .addCase(fetchHolidayConfigurations.fulfilled, (state, action: PayloadAction<HolidayConfiguration[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addHolidayConfiguration.fulfilled, (state, action: PayloadAction<HolidayConfiguration>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(updateHolidayConfiguration.fulfilled, (state, action: PayloadAction<HolidayConfiguration>) => {
          state.status = 'succeeded';
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
              state.items[index] = action.payload;
          }
      })
      .addCase(deleteHolidayConfiguration.fulfilled, (state, action: PayloadAction<string>) => {
          state.status = 'succeeded';
          state.items = state.items.filter(item => item.id !== action.payload);
      })
      // Use `addMatcher` to handle common pending and rejected states for all thunks
      .addMatcher(isPending(fetchHolidayConfigurations, addHolidayConfiguration, updateHolidayConfiguration, deleteHolidayConfiguration), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchHolidayConfigurations, addHolidayConfiguration, updateHolidayConfiguration, deleteHolidayConfiguration), (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'Failed to fetch holiday configuration';
      });
  },
});

export default holidayConfigurationSlice.reducer;
