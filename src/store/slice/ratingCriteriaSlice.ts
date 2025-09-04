import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

const API_BASE_URL = '/ratingCriteria/';

export interface RatingCriteria {
  id: string;
  criteriaName: string;
}

export interface RatingCriteriaState {
  data: RatingCriteria[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RatingCriteriaState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchRatingCriteria = createAsyncThunk(
  'ratingCriteria/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}get`);
      return response.data as RatingCriteria[];
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('An unknown error occurred while fetching criteria.');
    }
  }
);

export const addRatingCriteria = createAsyncThunk(
  'ratingCriteria/create',
  async (criteriaName: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}create`, { criteriaName });
      return { id: response.data.id, criteriaName };
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('An unknown error occurred while creating criteria.');
    }
  }
);

export const updateRatingCriteria = createAsyncThunk(
  'ratingCriteria/update',
  async ({ id, criteriaName }: { id: string; criteriaName: string }, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`${API_BASE_URL}update/${id}`, { criteriaName });
      return { id, criteriaName }; 
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('An unknown error occurred while updating criteria.');
    }
  }
);

export const deleteRatingCriteria = createAsyncThunk(
  'ratingCriteria/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}delete/${id}`);
      return id;
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('An unknown error occurred while deleting criteria.');
    }
  }
);

const ratingCriteriaSlice = createSlice({
  name: 'ratingCriteria',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatingCriteria.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchRatingCriteria.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRatingCriteria.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addRatingCriteria.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateRatingCriteria.fulfilled, (state, action) => {
        const index = state.data.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteRatingCriteria.fulfilled, (state, action) => {
        state.data = state.data.filter(c => c.id !== action.payload);
      });
  },
});

export default ratingCriteriaSlice.reducer;
