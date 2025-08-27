import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';

// --- CONSTANTS & HELPERS ---
const API_BASE_URL = 'http://172.50.5.49:3000/api/working-patterns/';
const getAuthToken = (): string | null => localStorage.getItem('accessToken');
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// --- TYPE DEFINITIONS ---
interface WorkingPatternFromAPI {
  id: string;
  name: string;
  code: string;
  schedule: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
}

export interface WorkingPattern {
  id: string;
  name: string;
  code: string;
  week1: boolean[];
  week2: boolean[];
  week3: boolean[];
  week4: boolean[];
}

export type NewWorkingPattern = Omit<WorkingPattern, 'id'>;

export interface WorkingPatternsState {
  items: WorkingPattern[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WorkingPatternsState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- HELPER FUNCTIONS FOR DATA TRANSFORMATION ---

/**
 * Transforms the API response (with day names as strings) into a UI-friendly format (with booleans).
 */
const transformApiDataToUI = (apiData: WorkingPatternFromAPI[]): WorkingPattern[] => {
  const dayMap: { [key: string]: number } = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
  const transformWeek = (days: string[]): boolean[] => {
    const weekBooleans = Array(7).fill(false);
    days.forEach(day => {
      const dayShort = day.slice(0, 3);
      if (dayMap[dayShort] !== undefined) {
        weekBooleans[dayMap[dayShort]] = true;
      }
    });
    return weekBooleans;
  };
  return apiData.map(item => ({
    id: item.id,
    name: item.name,
    code: item.code,
    week1: transformWeek(item.schedule.week1),
    week2: transformWeek(item.schedule.week2),
    week3: transformWeek(item.schedule.week3),
    week4: transformWeek(item.schedule.week4),
  }));
};

/**
 * Transforms the UI format (booleans) back into the API format (day names as strings).
 */
const transformUIToApiSchedule = (pattern: NewWorkingPattern | WorkingPattern) => {
    const booleanToDays = (week: boolean[]) => week.map((isWorking, i) => isWorking ? daysOfWeek[i] : null).filter(Boolean) as string[];
    return {
        week1: booleanToDays(pattern.week1),
        week2: booleanToDays(pattern.week2),
        week3: booleanToDays(pattern.week3),
        week4: booleanToDays(pattern.week4),
    };
};


// --- ASYNC THUNKS ---
export const fetchWorkingPatterns = createAsyncThunk('workingPatterns/fetch', async (_, { rejectWithValue }) => {
  const token = getAuthToken();
  if (!token) return rejectWithValue('Authentication token not found.');
  try {
    const response = await axios.get(`${API_BASE_URL}get`, { headers: { Authorization: `Bearer ${token}` } });
    return transformApiDataToUI(response.data as WorkingPatternFromAPI[]);
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch patterns');
    return rejectWithValue('An unknown error occurred.');
  }
});

export const addWorkingPattern = createAsyncThunk('workingPatterns/add', async (newPattern: NewWorkingPattern, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Authentication token not found.');
    const apiRequestBody = { name: newPattern.name, code: newPattern.code, schedule: transformUIToApiSchedule(newPattern) };
    try {
        const response = await axios.post(`${API_BASE_URL}create`, apiRequestBody, { headers: { Authorization: `Bearer ${token}` } });
        return { ...newPattern, id: response.data.id } as WorkingPattern;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to create pattern');
        return rejectWithValue('An unknown error occurred.');
    }
});

export const updateWorkingPattern = createAsyncThunk('workingPatterns/update', async (pattern: WorkingPattern, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Authentication token not found.');
    const apiRequestBody = { name: pattern.name, code: pattern.code, schedule: transformUIToApiSchedule(pattern) };
    try {
        await axios.put(`${API_BASE_URL}update/${pattern.id}`, apiRequestBody, { headers: { Authorization: `Bearer ${token}` } });
        return pattern;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update pattern');
        return rejectWithValue('An unknown error occurred.');
    }
});

// Added for completeness
export const deleteWorkingPattern = createAsyncThunk('workingPatterns/delete', async (id: string, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Authentication token not found.');
    try {
        await axios.delete(`${API_BASE_URL}delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        return id;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete pattern');
        return rejectWithValue('An unknown error occurred.');
    }
});


// --- SLICE DEFINITION ---
const workingPatternsSlice = createSlice({
  name: 'workingPatterns',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fulfilled cases are handled individually as their logic is unique
    builder
      .addCase(fetchWorkingPatterns.fulfilled, (state, action: PayloadAction<WorkingPattern[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addWorkingPattern.fulfilled, (state, action: PayloadAction<WorkingPattern>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(updateWorkingPattern.fulfilled, (state, action: PayloadAction<WorkingPattern>) => {
          state.status = 'succeeded';
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
              state.items[index] = action.payload;
          }
      })
      .addCase(deleteWorkingPattern.fulfilled, (state, action: PayloadAction<string>) => {
          state.status = 'succeeded';
          state.items = state.items.filter(item => item.id !== action.payload);
      })
      // OPTIMIZATION: Use `addMatcher` to handle common pending and rejected states
      // This will run for any async thunk from this slice that is in a 'pending' state
      .addMatcher(isPending(fetchWorkingPatterns, addWorkingPattern, updateWorkingPattern, deleteWorkingPattern), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      // This will run for any async thunk from this slice that is in a 'rejected' state
      .addMatcher(isRejected(fetchWorkingPatterns, addWorkingPattern, updateWorkingPattern, deleteWorkingPattern), (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export default workingPatternsSlice.reducer;
