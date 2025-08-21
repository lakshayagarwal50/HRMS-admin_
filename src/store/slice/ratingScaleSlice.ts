import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
// Assuming you have a configured axios instance like in your example
import { axiosInstance } from '../../services'; 

// --- Base URL for the API endpoints ---
const API_BASE_URL = '/api/ratingScale/';

// --- TYPE DEFINITIONS ---
// Matches the structure of the API response for a single scale
export interface RatingScale {
  id: string; // Firestore document ID
  scaleId: string;
  description: string;
  // Add other fields from your API if needed
}

// Defines the structure for the slice's state, matching your example
export interface RatingScaleState {
  data: RatingScale[]; // Changed from 'scales' to 'data' and initialized as an array
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// --- INITIAL STATE ---
const initialState: RatingScaleState = {
  data: [],
  status: 'idle',
  error: null,
};

// --- ASYNCHRONOUS THUNKS ---

// Thunk for fetching all rating scales
export const fetchRatingScales = createAsyncThunk(
  'ratingScale/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}get`);
      const scales = response.data as RatingScale[];
      // Sort the data by scaleId before returning
      return scales.sort((a, b) => parseInt(a.scaleId) - parseInt(b.scaleId));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch rating scales');
      }
      return rejectWithValue('An unknown error occurred while fetching rating scales.');
    }
  }
);

// Thunk for updating a single rating scale
export const updateRatingScale = createAsyncThunk(
  'ratingScale/update',
  async (scale: { scaleId: string; description: string }, { rejectWithValue }) => {
    try {
      // The API returns a success message, so we return the original payload on success
      await axiosInstance.put(`${API_BASE_URL}update`, scale);
      return scale;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update rating scale');
      }
      return rejectWithValue('An unknown error occurred while updating the rating scale.');
    }
  }
);

// --- THE SLICE ---
const ratingScaleSlice = createSlice({
  name: 'ratingScale',
  initialState,
  reducers: {}, // No synchronous reducers needed for this logic
  extraReducers: (builder) => {
    builder
      // Handle fetchRatingScales states
      .addCase(fetchRatingScales.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRatingScales.fulfilled, (state, action: PayloadAction<RatingScale[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRatingScales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Handle updateRatingScale states
      .addCase(updateRatingScale.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateRatingScale.fulfilled, (state, action: PayloadAction<{ scaleId: string; description: string }>) => {
        state.status = 'succeeded';
        const index = state.data.findIndex(s => s.scaleId === action.payload.scaleId);
        if (index !== -1) {
          state.data[index].description = action.payload.description;
        }
      })
      .addCase(updateRatingScale.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default ratingScaleSlice.reducer;
