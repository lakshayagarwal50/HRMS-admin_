import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../services";
import {type RootState } from "../store";


interface LeaveCategoryDetails {
  leaveTaken: number;
  balance: number;
  allowedLeave: number;
  unpaidLeave: number;
}

export interface LeaveRecord {
  emp_id: string;
  name: string;
  status: "Active" | "Inactive" | null;
  privileged: LeaveCategoryDetails;
  sick: LeaveCategoryDetails;
  casual: LeaveCategoryDetails;
  planned: LeaveCategoryDetails;
}

export interface LeaveReportTemplate {
  id: string;
  [key: string]: boolean | string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

interface LeaveReportState {
  data: LeaveRecord[];
  template: LeaveReportTemplate | null;
  pagination: Pagination;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  successMessage: string | null;
  templateId: string | null;
  isDownloading: boolean; 
}


const initialState: LeaveReportState = {
  data: [],
  template: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  },
  loading: 'idle',
  error: null,
  successMessage: null,
  templateId: null,
  isDownloading: false, 
};



export const fetchLeaveSummaryReport = createAsyncThunk(
  "leaveReport/fetchSummary",
  async (
    {
      page,
      limit,
      filter,
    }: { page: number; limit: number; filter?: Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(`/report/getAll/leave/leave`, {
        params: { page, limit, ...filter },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave report"
      );
    }
  }
);

export const fetchLeaveTemplate = createAsyncThunk(
  "leaveReport/fetchTemplate",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/report/getTemplate/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave template"
      );
    }
  }
);

export const updateLeaveTemplate = createAsyncThunk(
  "leaveReport/updateTemplate",
  async (
    { id, data }: { id: string; data: { [key: string]: boolean } },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/report/updateTemplate/leave/${id}`,
        data
      );
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update leave template"
      );
    }
  }
);

export const downloadLeaveReport = createAsyncThunk(
  "leaveReport/download",
  async (
    { format, filter }: { format: "csv" | "xlsx"; filter?: Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(`/report/export/leave`, {
        params: { format, ...filter },
        responseType: "blob",
      });
      return { data: response.data, format };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download report"
      );
    }
  }
);

const leaveReportSlice = createSlice({
  name: "leaveReport",
  initialState,
  reducers: {
    resetLeaveReportState: (state) => {
      state.loading = 'idle';
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
 
      .addCase(fetchLeaveSummaryReport.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchLeaveSummaryReport.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.data = action.payload.Leave;
        state.templateId = action.payload.templateId;
        state.pagination = {
          currentPage: action.payload.page,
          totalPages: Math.ceil(action.payload.total / action.payload.limit),
          totalRecords: action.payload.total,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchLeaveSummaryReport.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

     
      .addCase(fetchLeaveTemplate.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchLeaveTemplate.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.template = action.payload;
      })
      .addCase(fetchLeaveTemplate.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

      
      .addCase(updateLeaveTemplate.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateLeaveTemplate.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.successMessage = action.payload;
      })
      .addCase(updateLeaveTemplate.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

   
      .addCase(downloadLeaveReport.pending, (state) => {
        state.isDownloading = true;
        state.error = null;
      })
      .addCase(downloadLeaveReport.fulfilled, (state) => {
        state.isDownloading = false;
      })
      .addCase(downloadLeaveReport.rejected, (state, action) => {
        state.isDownloading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetLeaveReportState } = leaveReportSlice.actions;

export const selectLeaveReport = (state: RootState) => state.leaveReport;

export default leaveReportSlice.reducer;