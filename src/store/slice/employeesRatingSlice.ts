import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- Base URL for the API endpoint ---
const API_BASE_URL = '/api/ratings/get';

// --- TYPE DEFINITIONS ---
interface RatingFromAPI {
  id: string;
  empName: string;
  code: string;
  department: string;
  designation: string;
  yearOfExperience: number;
  overallAverage: number;
  ratings?: Record<string, any>; 
}

export interface EmployeeRating {
  id: string;
  employee: string;
  code: string;
  department: string;
  designation: string;
  yearOfExperience: number;
  overallAverageRating: number;
  ratings?: Record<string, any>;
}

export interface RatingFilters {
  year?: string;
  employeeId?: string;
  department?: string;
}

export interface EmployeesRatingState {
  items: EmployeeRating[];
  selectedRating: EmployeeRating | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  selectedStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EmployeesRatingState = {
  items: [],
  selectedRating: null,
  status: 'idle',
  selectedStatus: 'idle',
  error: null,
};

// --- DATA TRANSFORMATION ---
const transformApiData = (apiData: RatingFromAPI[]): EmployeeRating[] => {
  return apiData.map(item => ({
    id: item.id,
    employee: item.empName,
    code: item.code,
    department: item.department,
    designation: item.designation,
    yearOfExperience: item.yearOfExperience,
    overallAverageRating: item.overallAverage,
    ratings: item.ratings,
  }));
};

// --- ASYNC THUNKS ---
export const fetchEmployeeRatings = createAsyncThunk(
    'employeesRating/fetch', 
    async (filters: RatingFilters | null, { rejectWithValue }) => {
        try {
            const token = "YOUR_FIREBASE_ID_TOKEN";
            const response = await axiosInstance.get(API_BASE_URL, {
                headers: { Authorization: `Bearer ${token}` },
                params: filters || {},
            });
            return transformApiData(response.data.data as RatingFromAPI[]);
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

// This thunk now accepts an object with employeeId and year
export const fetchEmployeeRatingById = createAsyncThunk(
    'employeesRating/fetchById',
    async ({ employeeId, year }: { employeeId: string; year: string }, { rejectWithValue }) => {
        try {
            alert("hello")
            const token = "YOUR_FIREBASE_ID_TOKEN";
            const response = await axiosInstance.get(API_BASE_URL, {
                headers: { Authorization: `Bearer ${token}` },
                params: { employeeId, year }, // Pass both params to the API
            });
            const transformedData = transformApiData(response.data.data as RatingFromAPI[]);
            return transformedData[0];
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
            return rejectWithValue('Failed to fetch rating details.');
        }
    }
);


// --- SLICE DEFINITION ---
const employeesRatingSlice = createSlice({
  name: 'employeesRating',
  initialState,
  reducers: {
      clearSelectedRating: (state) => {
          state.selectedRating = null;
          state.selectedStatus = 'idle';
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeRatings.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchEmployeeRatings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEmployeeRatings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchEmployeeRatingById.pending, (state) => {
          state.selectedStatus = 'loading';
      })
      .addCase(fetchEmployeeRatingById.fulfilled, (state, action) => {
          state.selectedStatus = 'succeeded';
          state.selectedRating = action.payload;
      })
      .addCase(fetchEmployeeRatingById.rejected, (state, action) => {
          state.selectedStatus = 'failed';
          state.error = action.payload as string;
      });
  },
});

export const { clearSelectedRating } = employeesRatingSlice.actions;
export default employeesRatingSlice.reducer;
