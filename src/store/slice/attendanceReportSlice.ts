// src/store/slice/attendanceReportSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../services";
import { AxiosError } from "axios";

// =================================
// TYPE DEFINITIONS
// =================================

/**
 * @description Shape of a single attendance record returned by the API.
 */
export interface AttendanceRecord {
  emp_id: number;
  name: string;
  status: "Active" | "Inactive";
  attendanceStatus: "Leave" | "Weekoff" | "Present" | "Holiday";
  date: string;
  inTime: string;
  outTime: string;
  timeSpent: string;
  lateBy: string;
  earlyBy: string;
  overTime: string; // API key is overTime
}

/**
 * @description Type for the API response when fetching the summary report.
 */
interface FetchAttendanceSummaryResponse {
  templateId: string;
  page: number;
  limit: number;
  total: number;
  Attendance: AttendanceRecord[];
}

/**

 * @description Arguments for the fetchAttendanceSummary async thunk.
 */
interface FetchAttendanceSummaryArgs {
  page: number;
  limit: number;
  filter?: Record<string, any>;
}

/**
 * @description Shape of the template configuration object for the PATCH request.
 * Keys are the field names, values are booleans indicating if they are enabled.
 */
export interface AttendanceTemplateConfig {
  [key: string]: boolean;
}

/**
 * @description Arguments for the updateAttendanceTemplate async thunk.
 */
interface UpdateTemplateArgs {
  id: string;
  data: AttendanceTemplateConfig;
}

/**
 * @description Arguments for the downloadAttendanceSummary async thunk.
 */
interface DownloadSummaryArgs {
  format: "csv" | "excel";
  filter?: Record<string, any>;
}

/**
 * @description The structure of the state for this slice.
 */
interface AttendanceReportState {
  data: AttendanceRecord[];
  templateId: string | null;
  page: number;
  limit: number;
  totalItems: number;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  isDownloading: boolean;
}

// =================================
// INITIAL STATE
// =================================

const initialState: AttendanceReportState = {
  data: [],
  templateId: null,
  page: 1,
  limit: 10,
  totalItems: 0,
  loading: "idle",
  error: null,
  isDownloading: false,
};

// =================================
// ASYNC THUNKS
// =================================

export const fetchAttendanceSummary = createAsyncThunk<
  FetchAttendanceSummaryResponse,
  FetchAttendanceSummaryArgs,
  { rejectValue: string }
>(
  "attendanceReport/fetchSummary",
  async ({ page, limit, filter }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (filter && Object.keys(filter).length > 0) {
        params.append("filter", JSON.stringify(filter));
      }
      const response = await axiosInstance.get(
        `/report/getAll/attendance/attendanceSummary?${params.toString()}`
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(
        (error.response?.data as { message: string })?.message ||
          "Failed to fetch attendance summary."
      );
    }
  }
);

export const updateAttendanceTemplate = createAsyncThunk<
  { message: string },
  UpdateTemplateArgs,
  { rejectValue: string }
>(
  "attendanceReport/updateTemplate",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/report/updateTemplate/attendanceSummary/${id}`,
        data
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(
        (error.response?.data as { message: string })?.message ||
          "Failed to update template."
      );
    }
  }
);

export const downloadAttendanceSummary = createAsyncThunk<
  { fileData: Blob; fileName: string },
  DownloadSummaryArgs,
  { rejectValue: string }
>(
  "attendanceReport/downloadSummary",
  async ({ format, filter }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ format });
      if (filter && Object.keys(filter).length > 0) {
        params.append("filter", JSON.stringify(filter));
      }
      const response = await axiosInstance.get(
        `/report/export/attendanceSummary?${params.toString()}`,
        { responseType: "blob" }
      );
      const fileName = `attendance_summary_report_${new Date().toISOString()}.${format}`;
      return { fileData: response.data, fileName };
    } catch (err)      {
      const error = err as AxiosError;
      // Attempt to parse error from blob response if it exists
      if (error.response?.data instanceof Blob && error.response.data.type.includes('json')) {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        return rejectWithValue(errorJson.message || 'Failed to download file.');
      }
      return rejectWithValue("An unknown error occurred during download.");
    }
  }
);

// =================================
// SLICE
// =================================

const attendanceReportSlice = createSlice({
  name: "attendanceReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Summary Cases
      .addCase(fetchAttendanceSummary.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        fetchAttendanceSummary.fulfilled,
        (state, action: PayloadAction<FetchAttendanceSummaryResponse>) => {
          state.loading = "succeeded";
          state.data = action.payload.Attendance;
          state.templateId = action.payload.templateId;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.totalItems = action.payload.total;
        }
      )
      .addCase(fetchAttendanceSummary.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Update Template Cases (only handles loading/error for feedback)
      .addCase(updateAttendanceTemplate.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateAttendanceTemplate.fulfilled, (state) => {
        state.loading = "succeeded";
      })
      .addCase(updateAttendanceTemplate.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Download Summary Cases
      .addCase(downloadAttendanceSummary.pending, (state) => {
        state.isDownloading = true;
        state.error = null;
      })
      .addCase(downloadAttendanceSummary.fulfilled, (state, action) => {
        state.isDownloading = false;
        const url = window.URL.createObjectURL(action.payload.fileData);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = action.payload.fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      })
      .addCase(downloadAttendanceSummary.rejected, (state, action) => {
        state.isDownloading = false;
        state.error = action.payload as string; // Will be displayed as a toast
      });
  },
});

export default attendanceReportSlice.reducer;