import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- Base URL for the API endpoint ---
const API_BASE_URL = '/eventNotification/notification/get';

// --- TYPE DEFINITIONS ---
// This interface now matches the structure of a single record from your API
export interface Notification {
  id: string;
  type: string;
  name: string; // This is the employee's name
  status: string;
  date: string; // The date the request was made
  startDate: string;
  endDate: string;
  duration: number;
}

// The API response is an object with a 'records' array
interface ApiResponse {
    total: number;
    page: number;
    limit: number;
    records: Notification[];
}

// Defines the structure for this slice's state
export interface NotificationState {
  items: Notification[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotificationState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- ASYNCHRONOUS THUNKS ---
export const fetchNotifications = createAsyncThunk(
    'notifications/fetch', 
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
                return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
            }
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

// --- SLICE DEFINITION ---
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default notificationSlice.reducer;
