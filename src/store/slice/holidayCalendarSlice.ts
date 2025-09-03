import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; // 1. Use axiosInstance

// --- CONSTANTS ---
const API_BASE_URL = '/holidayCalendar/';

// --- TYPE DEFINITIONS ---
export interface HolidayCalendarEntry {
  id: string;
  name: string;
  type: string;
  date: string; // ISO date string
  holidayGroups: string[];
  createdBy: string;
  createdAt: string;
}

export type NewHolidayCalendarEntry = Omit<HolidayCalendarEntry, 'id' | 'createdBy' | 'createdAt'>;

export interface HolidayCalendarState {
  items: HolidayCalendarEntry[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HolidayCalendarState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---

/**
 * FETCH: Fetches all holiday calendar entries from the server.
 */
export const fetchHolidayCalendar = createAsyncThunk('holidayCalendar/fetch', async (_, { rejectWithValue }) => {
  try {
    // 2. Use axiosInstance directly without manual token handling
    const response = await axiosInstance.get(`${API_BASE_URL}get`);
    return response.data as HolidayCalendarEntry[];
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch holiday calendar');
    return rejectWithValue('An unknown error occurred.');
  }
});

/**
 * ADD: Creates a new holiday calendar entry on the server.
 */
export const addHolidayCalendarEntry = createAsyncThunk('holidayCalendar/add', async (newEntry: NewHolidayCalendarEntry, { rejectWithValue }) => {
    const apiRequestBody = {
        name: newEntry.name,
        type: newEntry.type,
        date: newEntry.date,
        holidayGroups: newEntry.holidayGroups,
    };

    try {
        // 3. Use axiosInstance for the POST request
        const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
        return { 
            ...newEntry, 
            id: response.data.id,
            createdBy: 'current-user-id', // Placeholder
            createdAt: new Date().toISOString(), // Placeholder
        } as HolidayCalendarEntry;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to create holiday');
        return rejectWithValue('An unknown error occurred.');
    }
});

/**
 * UPDATE: Updates an existing holiday calendar entry on the server.
 */
export const updateHolidayCalendarEntry = createAsyncThunk('holidayCalendar/update', async (entry: HolidayCalendarEntry, { rejectWithValue }) => {
    const { id, name, type, date, holidayGroups } = entry;
    const apiRequestBody = { name, type, date, holidayGroups };

    try {
        // 4. Use axiosInstance for the PUT request
        await axiosInstance.put(`${API_BASE_URL}update/${id}`, apiRequestBody);
        return entry;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update holiday');
        return rejectWithValue('An unknown error occurred.');
    }
});

/**
 * DELETE: Deletes a holiday calendar entry from the server.
 */
export const deleteHolidayCalendarEntry = createAsyncThunk('holidayCalendar/delete', async (id: string, { rejectWithValue }) => {
    try {
        // 5. Use axiosInstance for the DELETE request
        await axiosInstance.delete(`${API_BASE_URL}delete/${id}`);
        return id;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete holiday');
        return rejectWithValue('An unknown error occurred.');
    }
});


// --- SLICE DEFINITION ---
const holidayCalendarSlice = createSlice({
  name: 'holidayCalendar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fulfilled cases for each thunk
      .addCase(fetchHolidayCalendar.fulfilled, (state, action: PayloadAction<HolidayCalendarEntry[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addHolidayCalendarEntry.fulfilled, (state, action: PayloadAction<HolidayCalendarEntry>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(updateHolidayCalendarEntry.fulfilled, (state, action: PayloadAction<HolidayCalendarEntry>) => {
          state.status = 'succeeded';
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
              state.items[index] = action.payload;
          }
      })
      .addCase(deleteHolidayCalendarEntry.fulfilled, (state, action: PayloadAction<string>) => {
          state.status = 'succeeded';
          state.items = state.items.filter(item => item.id !== action.payload);
      })
      // Use `addMatcher` to handle common pending and rejected states for all thunks
      .addMatcher(isPending(fetchHolidayCalendar, addHolidayCalendarEntry, updateHolidayCalendarEntry, deleteHolidayCalendarEntry), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchHolidayCalendar, addHolidayCalendarEntry, updateHolidayCalendarEntry, deleteHolidayCalendarEntry), (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export default holidayCalendarSlice.reducer;
