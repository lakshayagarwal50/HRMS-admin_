import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';


const API_BASE_URL = '/eventNotification/notification/get';


export interface Notification {
  id: string;
  type: string;
  name: string; 
  status: string;
  date: string; 
  startDate: string;
  endDate: string;
  duration: number;
}

interface ApiResponse {
    total: number;
    page: number;
    limit: number;
    records: Notification[];
}


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


export const fetchNotifications = createAsyncThunk(
    'notifications/fetch', 
    async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const token = "YOUR_FIREBASE_ID_TOKEN"; // Replace with your token logic
            const response = await axiosInstance.get<ApiResponse>(API_BASE_URL, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, limit },
            });
            
            return response.data.records;
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
            }
            return rejectWithValue('An unknown error occurred.');
        }
    }
);


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
