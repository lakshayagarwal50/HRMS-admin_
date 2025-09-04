import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 


const API_BASE_URL = '/webCheckinSettings/';

export interface WebCheckinSettings {
  id?: string; 
  shiftStartTime: string;
  shiftEndTime: string;
  updatedAt?: number; 
}

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


export const fetchWebCheckinSettings = createAsyncThunk('webCheckinSettings/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}get`);
    return response.data as WebCheckinSettings;
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    return rejectWithValue('An unknown error occurred.');
  }
});


export const updateWebCheckinSettings = createAsyncThunk('webCheckinSettings/update', async (settings: WebCheckinSettings, { rejectWithValue }) => {
    
    const apiRequestBody = {
        shiftStartTime: settings.shiftStartTime,
        shiftEndTime: settings.shiftEndTime,
    };

    try {
      
        await axiosInstance.put(`${API_BASE_URL}update`, apiRequestBody);
    
        return settings;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
        return rejectWithValue('An unknown error occurred.');
    }
});



const webCheckinSettingsSlice = createSlice({
  name: 'webCheckinSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchWebCheckinSettings.fulfilled, (state, action: PayloadAction<WebCheckinSettings>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updateWebCheckinSettings.fulfilled, (state, action: PayloadAction<WebCheckinSettings>) => {
          state.status = 'succeeded';
          state.data = action.payload;
      })
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
