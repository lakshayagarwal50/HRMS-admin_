import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';

// --- CONSTANTS & HELPERS ---
const API_BASE_URL = 'http://172.50.5.116:3000/api/sequenceNumber/';
const getAuthToken = (): string | null => localStorage.getItem('accessToken');

// --- TYPE DEFINITIONS ---
// This interface matches the structure of the data from your API
export interface SequenceNumber {
  id: string;
  type: 'Employee' | 'Payslip' | '';
  prefix: string;
  nextAvailableNumber: number;
  // Added from GET response, optional for create
  createdBy?: string;
  createdAt?: string;
}

export type NewSequenceNumber = Omit<SequenceNumber, 'id' | 'createdBy' | 'createdAt'>;

export interface SequenceNumbersState {
  items: SequenceNumber[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SequenceNumbersState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---
export const fetchSequenceNumbers = createAsyncThunk('sequenceNumbers/fetch', async (_, { rejectWithValue }) => {
  const token = getAuthToken();
  if (!token) return rejectWithValue('Authentication token not found.');
  try {
    const response = await axios.get(`${API_BASE_URL}get`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data as SequenceNumber[];
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch sequence numbers');
    return rejectWithValue('An unknown error occurred.');
  }
});

export const addSequenceNumber = createAsyncThunk('sequenceNumbers/add', async (newSequence: NewSequenceNumber, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) return rejectWithValue('Authentication token not found.');
    try {
        const response = await axios.post(`${API_BASE_URL}create`, newSequence, { headers: { Authorization: `Bearer ${token}` } });
        // Construct the full object for the UI with the new ID
        return { ...newSequence, id: response.data.id } as SequenceNumber;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to create sequence number');
        return rejectWithValue('An unknown error occurred.');
    }
});


// --- SLICE DEFINITION ---
const sequenceNumberSlice = createSlice({
  name: 'sequenceNumbers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSequenceNumbers.fulfilled, (state, action: PayloadAction<SequenceNumber[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addSequenceNumber.fulfilled, (state, action: PayloadAction<SequenceNumber>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addMatcher(isPending(fetchSequenceNumbers, addSequenceNumber), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchSequenceNumbers, addSequenceNumber), (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export default sequenceNumberSlice.reducer;
