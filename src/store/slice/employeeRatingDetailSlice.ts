import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- Base URL for the API endpoint ---
const API_BASE_URL = '/api/ratings/';

// --- TYPE DEFINITIONS ---
// These types match the detailed structure of your API response
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
    scores: Scores;
    overallProjectRating: number;
    managerId?: string;
    reviewerName?: string;
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

// Helper to transform the raw API data into a more usable format
function mapApiToEmployeeRatingDetail(api: any): EmployeeRatingDetail {
    return {
        empName: api.empName,
        code: api.code,
        department: api.department,
        designation: api.designation,
        yearOfExperience: api.yearOfExperience,
        id: api.id,
        year: String(api.year),
        ratings: api.ratings || {},
        overallAverage: Number(api.overallAverage ?? 0),
    };
}

// --- SLICE STATE ---
export interface EmployeeRatingDetailState {
    data: EmployeeRatingDetail | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: EmployeeRatingDetailState = {
    data: null,
    status: 'idle',
    error: null,
};

// --- ASYNC THUNK ---
export const fetchEmployeeRatingDetail = createAsyncThunk<
    EmployeeRatingDetail,
    { employeeId: string; year: string | number },
    { rejectValue: string }
>("employeeRatingDetail/fetch", async ({ employeeId, year }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}get`, {
            params: { employeeId, year }
        });

        if (!response.data?.success || !Array.isArray(response.data.data) || response.data.data.length === 0) {
            return rejectWithValue("No data found for this employee/year.");
        }
        
        return mapApiToEmployeeRatingDetail(response.data.data[0]);
    } catch (err) {
        if (isAxiosError(err)) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch details.");
        }
        return rejectWithValue("An unknown error occurred.");
    }
});

// --- SLICE DEFINITION ---
const employeeRatingDetailSlice = createSlice({
    name: 'employeeRatingDetail',
    initialState,
    reducers: {
        clearDetail: (state) => {
            state.data = null;
            state.status = 'idle';
            state.error = null;
        }
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
            });
    }
});

export const { clearDetail } = employeeRatingDetailSlice.actions;
export default employeeRatingDetailSlice.reducer;
