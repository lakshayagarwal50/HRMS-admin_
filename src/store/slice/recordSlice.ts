import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- Base URL for the API endpoint ---
const API_BASE_URL = '/records/';

// --- TYPE DEFINITIONS ---
interface RecordFromAPI {
  id: string;
  month: string;
  employeeOpenFrom: string;
  employeeOpenTo: string;
  managerOpenFrom: string;
  managerOpenTo: string;
  requestedDate: string;
}

export interface Record {
  id: string;
  month: string;
  requestedDate: string;
  employeeWindow: string;
  managerWindow: string;
}

// Type for the POST request body when creating a new record
export interface NewRecordPayload {
    month: string;
    employeeOpenFrom: string;
    employeeOpenTo: string;
    managerOpenFrom: string;
    managerOpenTo: string;
}

export interface RecordsState {
  items: Record[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RecordsState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- DATA TRANSFORMATION ---
const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'NA') return 'NA';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const transformApiData = (apiData: RecordFromAPI[]): Record[] => {
  return apiData.map(item => ({
    id: item.id,
    month: item.month,
    requestedDate: formatDate(item.requestedDate),
    employeeWindow: `${formatDate(item.employeeOpenFrom)} - ${formatDate(item.employeeOpenTo)}`,
    managerWindow: `${formatDate(item.managerOpenFrom)} - ${formatDate(item.managerOpenTo)}`,
  }));
};

// --- ASYNC THUNKS ---
export const fetchRecords = createAsyncThunk(
    'records/fetch', 
    async (year: string | null, { rejectWithValue }) => {
        try {
            const token = "YOUR_FIREBASE_ID_TOKEN";
            const url = year ? `${API_BASE_URL}get?year=${year}` : `${API_BASE_URL}get`;
            const response = await axiosInstance.get(url, { headers: { Authorization: `Bearer ${token}` } });
            return transformApiData(response.data as RecordFromAPI[]);
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

export const addRecord = createAsyncThunk(
    'records/create',
    async (newRecord: NewRecordPayload, { rejectWithValue, dispatch }) => {
        try {
            const token = "YOUR_FIREBASE_ID_TOKEN";
            await axiosInstance.post(`${API_BASE_URL}create`, newRecord, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // After successfully creating, re-fetch the records to update the list
            dispatch(fetchRecords(null)); 
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

// --- SLICE DEFINITION ---
const recordSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecords.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchRecords.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchRecords.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
      // Add cases for the new thunk
      .addCase(addRecord.pending, (state) => { state.status = 'loading'; })
      .addCase(addRecord.fulfilled, (state) => { state.status = 'succeeded'; }) // No state change needed here as fetchRecords will handle it
      .addCase(addRecord.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
  },
});

export default recordSlice.reducer;
