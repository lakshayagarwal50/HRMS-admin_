// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// import { axiosInstance } from '../../services'; // Adjust path as needed

// // --- Interfaces ---

// export interface Report {
//     id: string;
//     Snum: string;
//     type: string;
//     name: string;
//     description: string;
//     isDeleted: boolean;
//     createdAt: number;
// }

// type CreateReportPayload = Omit<Report, 'id' | 'Snum' | 'isDeleted' | 'createdAt'>;

// interface CreateApiResponse {
//   message: string;
//   report: Report;
// }

// // Describes the expected API response shape on fetch success
// interface FetchApiResponse {
//     message: string;
//     reports: Report[];
//     page: number;
//     limit: number;
//     total: number;
// }

// // **MODIFIED**: Describes the shape of this slice's state
// interface ReportState {
//   reports: Report[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
//   // --- ADDED FOR PAGINATION ---
//   totalPages: number;
//   totalItems: number;
// }

// // **MODIFIED**: Initial state with new properties
// const initialState: ReportState = {
//   reports: [],
//   status: 'idle',
//   error: null,
//   // --- ADDED FOR PAGINATION ---
//   totalPages: 0,
//   totalItems: 0,
// };

// // --- ASYNC THUNKS ---

// // Thunk for creating a report (Unchanged)
// export const createReportAPI = createAsyncThunk<
//   CreateApiResponse,
//   CreateReportPayload,
//   { rejectValue: string }
// >(
//   'reports/create',
//   async (reportData, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post('/report/create', reportData);
//       return response.data as CreateApiResponse;
//     } catch (error: unknown) {
//       if (isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || 'Failed to create report.');
//       }
//       return rejectWithValue('An unknown error occurred. Please try again.');
//     }
//   }
// );

// // **MODIFIED**: Thunk for fetching paginated reports
// export const fetchAllReports = createAsyncThunk<
//   FetchApiResponse, // Return the full API response object
//   { page: number; limit: number }, // Accept page and limit arguments
//   { rejectValue: string }
// >(
//   'reports/fetchAll',
//   async ({ page, limit }, { rejectWithValue }) => {
//     try {
//       // Pass page and limit as query parameters to the API
//       const response = await axiosInstance.get<FetchApiResponse>(`/report/getAll?page=${page}&limit=${limit}`);
//       return response.data; // Return the entire payload
//     } catch (error: unknown) {
//       if (isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || 'Failed to fetch reports.');
//       }
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );

// // --- SLICE DEFINITION ---

// const reportSlice = createSlice({
//   name: 'reports',
//   initialState,
//   reducers: {
//     clearReportError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Cases for creating a report (Unchanged)
//       .addCase(createReportAPI.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(createReportAPI.fulfilled, (state, action: PayloadAction<CreateApiResponse>) => {
//         state.status = 'succeeded';
//         state.reports.push(action.payload.report);
//       })
//       .addCase(createReportAPI.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       })
      
//       // **MODIFIED**: Cases for fetching paginated reports
//       .addCase(fetchAllReports.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchAllReports.fulfilled, (state, action: PayloadAction<FetchApiResponse>) => {
//         state.status = 'succeeded';
//         state.reports = action.payload.reports;
//         state.totalItems = action.payload.total;
//         // Calculate total pages based on total items and items per page
//         state.totalPages = Math.ceil(action.payload.total / action.payload.limit);
//       })
//       .addCase(fetchAllReports.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearReportError } = reportSlice.actions;
// export default reportSlice.reducer;
// src/store/slice/reportSlice.ts (UPDATED)
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; // Adjust path as needed

// --- Interfaces ---

export interface Report {
    id: string;
    Snum: string;
    type: string;
    name: string;
    description: string;
    isDeleted: boolean;
    createdAt: number;
}

export interface ScheduledReport {
  id: string;
  frequency: string;
  startDate: string;
  hours: string;
  minutes: string;
  format: string;
  to: string;
  cc: string;
  subject: string;
  body: string;
  reportId: string;
  nextRunDate: string;
  // Add any other fields you need from the response
}

// **NEW**: Interface for the GET All Scheduled Reports response
interface FetchScheduledApiResponse {
  reports: ScheduledReport[]; // The API uses the key "reports" for this list
  page: number;
  limit: number;
  total: number;
}


type CreateReportPayload = Omit<Report, 'id' | 'Snum' | 'isDeleted' | 'createdAt'>;

interface CreateApiResponse {
  message: string;
  report: Report;
}

interface FetchApiResponse {
    message: string;
    reports: Report[];
    page: number;
    limit: number;
    total: number;
}

// Interface for the schedule report data
export interface ScheduleReportData {
  frequency: string;
  startDate: string;
  hours: string;
  minutes: string;
  format: 'CSV' | 'EXCEL';
  to: string;
  cc: string;
  subject: string;
  body: string;
}

// Interface for the schedule thunk payload
interface ScheduleReportPayload {
  reportId: string;
  scheduleData: ScheduleReportData;
}

interface UpdateScheduledReportPayload {
  scheduleId: string;
  updatedData: Partial<ScheduleReportData>; // Use Partial as not all fields may be sent
}

interface ReportState {
  
  reports: Report[];
  scheduledReports: ScheduledReport[]; // **NEW**
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  scheduleStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  // Pagination for the main reports list
  totalPages: number;
  totalItems: number;
  // **NEW**: Pagination for the scheduled reports list
  scheduledTotalPages: number;
  scheduledTotalItems: number;
}

const initialState: ReportState = {
  
  reports: [],
  scheduledReports: [], // **NEW**
  status: 'idle',
  scheduleStatus: 'idle',
  error: null,
  totalPages: 0,
  totalItems: 0,
  scheduledTotalPages: 0, // **NEW**
  scheduledTotalItems: 0, // **NEW**
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

// Thunk for fetching paginated reports
export const fetchAllReports = createAsyncThunk<
  FetchApiResponse,
  { page: number; limit: number },
  { rejectValue: string }
>(
  'reports/fetchAll',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<FetchApiResponse>(`/report/getAll?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch reports.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// Thunk for scheduling a report
export const scheduleReportAPI = createAsyncThunk(
  'reports/scheduleReport',
  async ({ reportId, scheduleData }: ScheduleReportPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/report/schedule/create/${reportId}`,
        scheduleData
      );
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to schedule report.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const deleteReport = createAsyncThunk<
  string, // On success, we'll return the ID of the deleted report
  string, // The thunk accepts the report ID as an argument
  { rejectValue: string }
>(
  'reports/deleteReport',
  async (reportId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/report/delete/${reportId}`);
      return reportId; // Return the ID on success
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to delete report.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// **NEW**: Thunk for fetching all scheduled reports
export const fetchScheduledReports = createAsyncThunk<
  FetchScheduledApiResponse,
  { page: number; limit: number },
  { rejectValue: string }
>(
  'reports/fetchScheduled',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<FetchScheduledApiResponse>(`/report/schedule/getAll?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: unknown) {
      // This logic ensures a value is ALWAYS returned from the catch block
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch scheduled reports.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// **NEW**: Thunk for updating a scheduled report
export const updateScheduledReport = createAsyncThunk(
  'reports/updateScheduled',
  async ({ scheduleId, updatedData }: UpdateScheduledReportPayload, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/report/schedule/${scheduleId}`, updatedData);
      // Return the original payload on success to update the state
      return { scheduleId, updatedData };
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to update report.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// **NEW**: Thunk for deleting a scheduled report
export const deleteScheduledReport = createAsyncThunk<
  string, // Return the ID of the deleted report on success
  string, // Thunk accepts the scheduleId as an argument
  { rejectValue: string }
>(
  'reports/deleteScheduled',
  async (scheduleId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/report/delete/schedule/${scheduleId}`);
      return scheduleId; // Return the ID for optimistic update
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to delete scheduled report.');
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
    resetScheduleStatus: (state) => {
        state.scheduleStatus = 'idle';
    }
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
      
      // Cases for fetching paginated reports
      .addCase(fetchAllReports.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllReports.fulfilled, (state, action: PayloadAction<FetchApiResponse>) => {
        state.status = 'succeeded';
        state.reports = action.payload.reports;
        state.totalItems = action.payload.total;
        state.totalPages = Math.ceil(action.payload.total / action.payload.limit);
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Cases for scheduling a report
      .addCase(scheduleReportAPI.pending, (state) => {
        state.scheduleStatus = 'loading';
        state.error = null;
      })
      .addCase(scheduleReportAPI.fulfilled, (state) => {
        state.scheduleStatus = 'succeeded';
      })
      .addCase(scheduleReportAPI.rejected, (state, action) => {
        state.scheduleStatus = 'failed';
        state.error = action.payload as string;
      })
      // **NEW**: Cases for deleting a report
      .addCase(deleteReport.pending, (state) => {
        state.status = 'loading'; // Reuse the main status for loading feedback
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        // Optionally, you can remove the report from the state immediately
        // state.reports = state.reports.filter((report) => report.id !== action.payload);
        // But since we are re-fetching, this isn't strictly necessary.
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // **NEW**: Cases for fetching scheduled reports
      .addCase(fetchScheduledReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScheduledReports.fulfilled, (state, action: PayloadAction<FetchScheduledApiResponse>) => {
        state.status = 'succeeded';
        state.scheduledReports = action.payload.reports;
        state.scheduledTotalItems = action.payload.total;
        state.scheduledTotalPages = Math.ceil(action.payload.total / action.payload.limit);
      })
      .addCase(fetchScheduledReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // **NEW**: Cases for updating a scheduled report
      .addCase(updateScheduledReport.pending, (state) => {
        state.scheduleStatus = 'loading';
        state.error = null;
      })
      .addCase(updateScheduledReport.fulfilled, (state, action) => {
        state.scheduleStatus = 'succeeded';
        const { scheduleId, updatedData } = action.payload;
        const index = state.scheduledReports.findIndex(report => report.id === scheduleId);
        if (index !== -1) {
          // Update the existing report in the array with the new data
          state.scheduledReports[index] = {
            ...state.scheduledReports[index],
            ...updatedData,
          };
        }
      })
      .addCase(updateScheduledReport.rejected, (state, action) => {
        state.scheduleStatus = 'failed';
        state.error = action.payload as string;
      })
      // **NEW**: Cases for deleting a scheduled report
      .addCase(deleteScheduledReport.pending, (state) => {
        state.scheduleStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteScheduledReport.fulfilled, (state, action: PayloadAction<string>) => {
        state.scheduleStatus = 'succeeded';
        // Optimistically remove the deleted report from the state array
        state.scheduledReports = state.scheduledReports.filter(
          (report) => report.id !== action.payload
        );
        state.scheduledTotalItems -= 1; // Decrement the total count
      })
      .addCase(deleteScheduledReport.rejected, (state, action) => {
        state.scheduleStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearReportError, resetScheduleStatus } = reportSlice.actions;
export default reportSlice.reducer;