import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 


const API_BASE_URL = '/ratingScale/';


export interface RatingScale {
  id: string; 
  scaleId: string;
  description: string;
 
}

export interface RatingScaleState {
  data: RatingScale[]; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}


const initialState: RatingScaleState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchRatingScales = createAsyncThunk(
  'ratingScale/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}get`);
      const scales = response.data as RatingScale[];
      
      return scales.sort((a, b) => parseInt(a.scaleId) - parseInt(b.scaleId));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch rating scales');
      }
      return rejectWithValue('An unknown error occurred while fetching rating scales.');
    }
  }
);

export const updateRatingScale = createAsyncThunk(
  'ratingScale/update',
  async (scale: { scaleId: string; description: string }, { rejectWithValue }) => {
    try {
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


const ratingScaleSlice = createSlice({
  name: 'ratingScale',
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
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
