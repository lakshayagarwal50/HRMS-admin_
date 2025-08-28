import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- Base URL for the API endpoint ---
const API_BASE_URL = '/api/dashboard/events/get';

// --- TYPE DEFINITIONS ---
// This interface matches the structure of a single record from your API
export interface Event {
  id: string;
  description: string;
  date: string;
  createdAt: string;
}

// The API response is an object with a 'records' array
interface ApiResponse {
    total: number;
    page: number;
    limit: number;
    records: Event[];
}

// Defines the structure for this slice's state
export interface EventsState {
  items: Event[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EventsState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- ASYNCHRONOUS THUNKS ---
export const fetchEvents = createAsyncThunk(
    'events/fetch', 
    async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const token = "YOUR_FIREBASE_ID_TOKEN"; // Replace with your token logic
            const response = await axiosInstance.get<ApiResponse>(API_BASE_URL, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, limit },
            });
            // Correctly extract the 'records' array from the response data
            return response.data.records;
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
            }
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

// --- SLICE DEFINITION ---
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default eventsSlice.reducer;
