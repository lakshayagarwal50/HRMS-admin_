import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- TYPE DEFINITIONS to match your API response ---

export interface Scores {
    clearGoals: number;
    accountability: number;
    teamwork: number;
    technicalSkills: number;
    communicationLevels: number;
    conflictsWellManaged: number;
}

export interface ProjectRating {
    projectName: string;
    managerId: string;
    reviewerName: string;
    scores: Scores;
    overallProjectRating: number;
    areaOfDevelopment?: string;
}

export interface MonthData {
    projects: ProjectRating[];
    monthlyAverage: number;
}

export type RatingsByMonth = Record<string, MonthData>;

export interface EmployeeRatingDetail {
    empName: string;
    code: string;
    department: string;
    designation: string;
    yearOfExperience: number;
    id: string;
    year: string;
    ratings: RatingsByMonth;
    overallAverage: number;
}

// Type for the data sent when updating a rating
export interface UpdateRatingPayload {
    employeeId: string;
    year: string;
    month: string;
    projectName: string;
    scores: Partial<Scores>; // Use Partial as not all scores might be sent
    areaOfDevelopment?: string;
}


interface EmployeeRatingDetailState {
  data: EmployeeRatingDetail | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EmployeeRatingDetailState = {
  data: null,
  status: 'idle',
  error: null,
};

// --- DATA TRANSFORMATION ---
const mapApiToEmployeeRatingDetail = (apiData: any): EmployeeRatingDetail => ({
    empName: apiData.empName,
    code: apiData.code,
    department: apiData.department,
    designation: apiData.designation,
    yearOfExperience: apiData.yearOfExperience,
    id: apiData.id,
    year: String(apiData.year),
    ratings: apiData.ratings || {},
    overallAverage: Number(apiData.overallAverage || 0),
});

// --- ASYNC THUNKS ---
export const fetchEmployeeRatingDetail = createAsyncThunk(
  'employeeRatingDetail/fetch',
  async ({ employeeId, year }: { employeeId: string; year: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/ratings/get', {
        params: { employeeId, year },
      });
      if (!response.data?.success || !Array.isArray(response.data.data) || response.data.data.length === 0) {
        return rejectWithValue('No data found for this employee/year.');
      }
      return mapApiToEmployeeRatingDetail(response.data.data[0]);
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch details');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const updateEmployeeRating = createAsyncThunk(
    'employeeRatingDetail/update',
    async (payload: UpdateRatingPayload, { rejectWithValue, dispatch }) => {
        try {
            // *** THIS IS THE CORRECTED PART ***
            // Using PUT method and the correct endpoint
            await axiosInstance.put('/api/ratings/update', payload);
            
            // On success, re-fetch the data to ensure the UI is up-to-date
            const { employeeId, year } = payload;
            dispatch(fetchEmployeeRatingDetail({ employeeId, year }));
            return; // Return nothing as re-fetch handles the state update
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to update rating');
            }
            return rejectWithValue('An unknown error occurred.');
        }
    }
);


// --- SLICE DEFINITION ---
const employeeRatingDetailSlice = createSlice({
  name: 'employeeRatingDetail',
  initialState,
  reducers: {
    clearDetail: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeRatingDetail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmployeeRatingDetail.fulfilled, (state, action: PayloadAction<EmployeeRatingDetail>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchEmployeeRatingDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateEmployeeRating.pending, (state) => {
        // You can set a specific 'updating' status here if needed
      });
  },
});

export const { clearDetail } = employeeRatingDetailSlice.actions;
export default employeeRatingDetailSlice.reducer;

