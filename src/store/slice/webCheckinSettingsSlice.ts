import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
// Correctly import the configured axios instance
import { axiosInstance } from '../../services'; 

// --- CONSTANTS ---
const API_BASE_URL = '/api/webCheckinSettings/';

// --- TYPE DEFINITIONS ---
// This interface now matches the full structure from your GET API response
export interface WebCheckinSettings {
  id?: string; // Optional as it's not in the PUT body
  shiftStartTime: string;
  shiftEndTime: string;
  updatedAt?: number; // Optional as it's not in the PUT body
}

// Defines the structure of the Redux slice state
export interface WebCheckinSettingsState {
  data: WebCheckinSettings | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WebCheckinSettingsState = {
  data: null,
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---

/**
 * FETCH: Fetches the current web check-in settings from the server.
 */
export const fetchWebCheckinSettings = createAsyncThunk('webCheckinSettings/fetch', async (_, { rejectWithValue }) => {
  try {
    // Updated: Uses axiosInstance, no need for manual token handling
    const response = await axiosInstance.get(`${API_BASE_URL}get`);
    return response.data as WebCheckinSettings;
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    return rejectWithValue('An unknown error occurred.');
  }
});


/**
 * UPDATE: Updates the web check-in settings on the server.
 */
export const updateWebCheckinSettings = createAsyncThunk('webCheckinSettings/update', async (settings: WebCheckinSettings, { rejectWithValue }) => {
    // The body only needs the start and end time
    const apiRequestBody = {
        shiftStartTime: settings.shiftStartTime,
        shiftEndTime: settings.shiftEndTime,
    };

    try {
        // Updated: Uses axiosInstance
        await axiosInstance.put(`${API_BASE_URL}update`, apiRequestBody);
        // Return the updated settings object to the reducer on success
        return settings;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
        return rejectWithValue('An unknown error occurred.');
    }
});


// --- SLICE DEFINITION ---
const webCheckinSettingsSlice = createSlice({
  name: 'webCheckinSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fulfilled cases for each thunk
      .addCase(fetchWebCheckinSettings.fulfilled, (state, action: PayloadAction<WebCheckinSettings>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updateWebCheckinSettings.fulfilled, (state, action: PayloadAction<WebCheckinSettings>) => {
          state.status = 'succeeded';
          state.data = action.payload;
      })
      // Use `addMatcher` to handle common pending and rejected states for all thunks
      .addMatcher(isPending(fetchWebCheckinSettings, updateWebCheckinSettings), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchWebCheckinSettings, updateWebCheckinSettings), (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export default webCheckinSettingsSlice.reducer;
