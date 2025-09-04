import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

const API_BASE_URL = '/eventNotification/events/get';

export interface Event {
  id: string;
  description: string;
  date: string;
  createdAt: string;
}


interface ApiResponse {
    total: number;
    page: number;
    limit: number;
    records: Event[];
}

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


export const fetchEvents = createAsyncThunk(
    'events/fetch', 
    async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const token = "YOUR_FIREBASE_ID_TOKEN"; 
            const response = await axiosInstance.get<ApiResponse>(API_BASE_URL, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, limit },
            });
          
            return response.data.records;
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
            }
            return rejectWithValue('An unknown error occurred.');
        }
    }
);


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
