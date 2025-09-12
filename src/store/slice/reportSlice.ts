
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';
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
}

interface FetchScheduledApiResponse {
  reports: ScheduledReport[];
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

export interface ScheduleReportData {
  frequency: string;
  startDate: string;
  hours: string;
  minutes: string;
  format: 'CSV' | 'XLSX';
  to: string;
  cc: string;
  subject: string;
  body: string;
}

interface ScheduleReportPayload {
  reportId: string;
  scheduleData: ScheduleReportData;
}

interface UpdateScheduledReportPayload {
  scheduleId: string;
  updatedData: Partial<ScheduleReportData>;
}

interface ReportState {
  reports: Report[];
  scheduledReports: ScheduledReport[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  scheduleStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalPages: number;
  totalItems: number;
  scheduledTotalPages: number;
  scheduledTotalItems: number;
}

const initialState: ReportState = {
  reports: [],
  scheduledReports: [],
  status: 'idle',
  scheduleStatus: 'idle',
  error: null,
  totalPages: 0,
  totalItems: 0,
  scheduledTotalPages: 0,
  scheduledTotalItems: 0,
};
// create report thunk
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
        const errorMessage = error.response.data?.error || error.response.data?.message || 'Failed to create report.';
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('An unknown error occurred. Please try again.');
    }
  }
);

// Arguments interface for fetchAllReports
interface FetchReportsArgs {
  page: number;
  limit: number;
  search?: string;
}

// Updated fetchAllReports thunk
export const fetchAllReports = createAsyncThunk<
  FetchApiResponse,
  FetchReportsArgs,
  { rejectValue: string }
>(
  'reports/fetchAll',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) {
        params.append('search', search);
      }
      
      const response = await axiosInstance.get<FetchApiResponse>(`/report/getAll?${params.toString()}`);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch reports.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// schedule report thunk
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
  string,
  string,
  { rejectValue: string }
>(
  'reports/deleteReport',
  async (reportId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/report/delete/${reportId}`);
      return reportId;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to delete report.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

interface FetchScheduledReportsArgs {
  page: number;
  limit: number;
  search?: string;
}
export const fetchScheduledReports = createAsyncThunk<
  FetchScheduledApiResponse,
  FetchScheduledReportsArgs, 
  { rejectValue: string }
>(
  'reports/fetchScheduled',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) {
        params.append('search', search);
      }

      const response = await axiosInstance.get<FetchScheduledApiResponse>(`/report/schedule/getAll?${params.toString()}`);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {     
        const errorMessage = error.response.data?.error || error.response.data?.message || 'Failed to fetch scheduled reports.';
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const updateScheduledReport = createAsyncThunk(
  'reports/updateScheduled',
  async ({ scheduleId, updatedData }: UpdateScheduledReportPayload, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/report/schedule/${scheduleId}`, updatedData);
      return { scheduleId, updatedData };
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to update report.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const deleteScheduledReport = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'reports/deleteScheduled',
  async (scheduleId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/report/delete/schedule/${scheduleId}`);
      return scheduleId;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to delete scheduled report.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);


// --- SLICE ---
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
      //  Cases for deleting a report
      .addCase(deleteReport.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //  Cases for fetching scheduled reports
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
      //  Cases for updating a scheduled report
      .addCase(updateScheduledReport.pending, (state) => {
        state.scheduleStatus = 'loading';
        state.error = null;
      })
      .addCase(updateScheduledReport.fulfilled, (state, action) => {
        state.scheduleStatus = 'succeeded';
        const { scheduleId, updatedData } = action.payload;
        const index = state.scheduledReports.findIndex(report => report.id === scheduleId);
        if (index !== -1) {
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
      // Cases for deleting a scheduled report
      .addCase(deleteScheduledReport.pending, (state) => {
        state.scheduleStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteScheduledReport.fulfilled, (state, action: PayloadAction<string>) => {
        state.scheduleStatus = 'succeeded';
        state.scheduledReports = state.scheduledReports.filter(
          (report) => report.id !== action.payload
        );
        state.scheduledTotalItems -= 1;
      })
      .addCase(deleteScheduledReport.rejected, (state, action) => {
        state.scheduleStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearReportError, resetScheduleStatus } = reportSlice.actions;
export default reportSlice.reducer;