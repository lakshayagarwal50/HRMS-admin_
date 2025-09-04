import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 

const API_BASE_URL = '/sequenceNumber/';

export interface SequenceNumber {
  id: string;
  type: 'Employee' | 'Payslip' | '';
  prefix: string;
  nextAvailableNumber: number;
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

export const fetchSequenceNumbers = createAsyncThunk('sequenceNumbers/fetch', async (_, { rejectWithValue }) => {
  try {
   
    const response = await axiosInstance.get(`${API_BASE_URL}get`);
    return response.data as SequenceNumber[];
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch sequence numbers');
    return rejectWithValue('An unknown error occurred.');
  }
});

export const addSequenceNumber = createAsyncThunk('sequenceNumbers/add', async (newSequence: NewSequenceNumber, { rejectWithValue }) => {
    try {
       
        const response = await axiosInstance.post(`${API_BASE_URL}create`, newSequence);
        return { ...newSequence, id: response.data.id } as SequenceNumber;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to create sequence number');
        return rejectWithValue('An unknown error occurred.');
    }
});



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
