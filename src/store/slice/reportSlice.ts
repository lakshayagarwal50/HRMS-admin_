// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// // 1. Import isAxiosError for type-safe error handling
// import { isAxiosError } from 'axios';
// // 2. Import your configured axios instance (adjust the path as needed)
// import { axiosInstance } from '../../services'; 

// // --- Interfaces ---

// // Describes a single report object from the API response
// export interface Report {
//   id: string;
//   Snum: string;
//   type: string;
//   name: string;
//   description: string;
//   isDeleted: boolean;
//   createdAt: number;
// }

// // Describes the data needed to create a new report
// type CreateReportPayload = Omit<Report, 'id' | 'Snum' | 'isDeleted' | 'createdAt'>;

// // Describes the expected API response shape on success
// interface ApiResponse {
//   message: string;
//   report: Report;
// }

// // Describes the shape of this slice's state
// interface ReportState {
//   reports: Report[];
//   submitting: boolean;
//   error: string | null;
// }

// const initialState: ReportState = {
//   reports: [],
//   submitting: false,
//   error: null,
// };

// // --- ASYNC THUNK RENAMED ---

// export const createReportAPI = createAsyncThunk<
//   ApiResponse,           // Type for a successful return
//   CreateReportPayload,   // Type for the input payload
//   { rejectValue: string } // Type for the rejection payload
// >(
//   'reports/create',
//   async (reportData, { rejectWithValue }) => {
//     try {
//       // Use the configured axiosInstance with a relative URL
//       const response = await axiosInstance.post('/report/create', reportData);
//       return response.data as ApiResponse;
//     } catch (error: unknown) {
//       // Use isAxiosError to safely access error.response
//       if (isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || 'Failed to create report.');
//       }
//       // Handle non-Axios errors
//       return rejectWithValue('An unknown error occurred. Please try again.');
//     }
//   }
// );

// // --- SLICE DEFINITION ---

// const reportSlice = createSlice({
//   name: 'reports',
//   initialState,
//   reducers: {
//     // A simple reducer to clear any existing error messages
//     clearReportError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createReportAPI.pending, (state) => {
//         state.submitting = true;
//         state.error = null;
//       })
//       .addCase(createReportAPI.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
//         state.submitting = false;
//         // Add the new report from the API response to our state array
//         state.reports.push(action.payload.report);
//       })
//       .addCase(createReportAPI.rejected, (state, action) => {
//         state.submitting = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// // Export the synchronous action
// export const { clearReportError } = reportSlice.actions;

// // Export the reducer as the default export
// export default reportSlice.reducer;
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; // Adjust path as needed

// --- Interfaces ---

// Describes a single report object from the API response
export interface Report {
    id: string;
    Snum: string;
    type: string;
    name: string;
    description: string;
    isDeleted: boolean;
    createdAt: number;
  }

// Describes the data needed to create a new report
type CreateReportPayload = Omit<Report, 'id' | 'Snum' | 'isDeleted' | 'createdAt'>;

// Describes the expected API response shape on creation success
interface CreateApiResponse {
  message: string;
  report: Report;
}

// Describes the expected API response shape on fetch success
interface FetchApiResponse {
    message: string;
    reports: Report[];
    page: number;
    limit: number;
    total: number;
}

// Describes the shape of this slice's state
interface ReportState {
  reports: Report[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReportState = {
  reports: [],
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---

// Thunk for creating a report
export const createReportAPI = createAsyncThunk<
  CreateApiResponse,
  CreateReportPayload,
  { rejectValue: string }
>(
  'reports/create',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/report/create', reportData);
      return response.data as CreateApiResponse;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to create report.');
      }
      return rejectWithValue('An unknown error occurred. Please try again.');
    }
  }
);

// Thunk for fetching all reports
export const fetchAllReports = createAsyncThunk<
  Report[],
  void,
  { rejectValue: string }
>(
  'reports/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<FetchApiResponse>('/report/getAll');
      return response.data.reports;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch reports.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// --- SLICE DEFINITION ---

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases for creating a report
      .addCase(createReportAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createReportAPI.fulfilled, (state, action: PayloadAction<CreateApiResponse>) => {
        state.status = 'succeeded';
        state.reports.push(action.payload.report);
      })
      .addCase(createReportAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Cases for fetching all reports
      .addCase(fetchAllReports.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllReports.fulfilled, (state, action: PayloadAction<Report[]>) => {
        state.status = 'succeeded';
        state.reports = action.payload;
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearReportError } = reportSlice.actions;
export default reportSlice.reducer;