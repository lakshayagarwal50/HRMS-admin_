// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosInstance } from "../../services";
// import {type RootState } from "../store";


// interface LeaveCategoryDetails {
//   leaveTaken: number;
//   balance: number;
//   allowedLeave: number;
//   unpaidLeave: number;
// }

// export interface LeaveRecord {
//   emp_id: string;
//   name: string;
//   status: "Active" | "Inactive" | null;
//   privileged: LeaveCategoryDetails;
//   sick: LeaveCategoryDetails;
//   casual: LeaveCategoryDetails;
//   planned: LeaveCategoryDetails;
// }

// export interface LeaveReportTemplate {
//   id: string;
//   [key: string]: boolean | string;
// }

// interface Pagination {
//   currentPage: number;
//   totalPages: number;
//   totalRecords: number;
//   limit: number;
// }

// interface LeaveReportState {
//   data: LeaveRecord[];
//   template: LeaveReportTemplate | null;
//   pagination: Pagination;
//   loading: 'idle' | 'pending' | 'succeeded' | 'failed';
//   error: string | null;
//   successMessage: string | null;
//   templateId: string | null;
//   isDownloading: boolean; 
// }


// const initialState: LeaveReportState = {
//   data: [],
//   template: null,
//   pagination: {
//     currentPage: 1,
//     totalPages: 1,
//     totalRecords: 0,
//     limit: 10,
//   },
//   loading: 'idle',
//   error: null,
//   successMessage: null,
//   templateId: null,
//   isDownloading: false, 
// };



// export const fetchLeaveSummaryReport = createAsyncThunk(
//   "leaveReport/fetchSummary",
//   async (
//     {
//       page,
//       limit,
//       filter,
//     }: { page: number; limit: number; filter?: Record<string, any> },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.get(`/report/getAll/leave/leave`, {
//         params: { page, limit, ...filter },
//       });
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch leave report"
//       );
//     }
//   }
// );

// export const fetchLeaveTemplate = createAsyncThunk(
//   "leaveReport/fetchTemplate",
//   async ({ id }: { id: string }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/report/getTemplate/${id}`);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch leave template"
//       );
//     }
//   }
// );

// export const updateLeaveTemplate = createAsyncThunk(
//   "leaveReport/updateTemplate",
//   async (
//     { id, data }: { id: string; data: { [key: string]: boolean } },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.patch(
//         `/report/updateTemplate/leave/${id}`,
//         data
//       );
//       return response.data.message;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update leave template"
//       );
//     }
//   }
// );

// export const downloadLeaveReport = createAsyncThunk(
//   "leaveReport/download",
//   async (
//     { format, filter }: { format: "csv" | "xlsx"; filter?: Record<string, any> },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.get(`/report/export/leave`, {
//         params: { format, ...filter },
//         responseType: "blob",
//       });
//       return { data: response.data, format };
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to download report"
//       );
//     }
//   }
// );

// const leaveReportSlice = createSlice({
//   name: "leaveReport",
//   initialState,
//   reducers: {
//     resetLeaveReportState: (state) => {
//       state.loading = 'idle';
//       state.error = null;
//       state.successMessage = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
 
//       .addCase(fetchLeaveSummaryReport.pending, (state) => {
//         state.loading = 'pending';
//         state.error = null;
//       })
//       .addCase(fetchLeaveSummaryReport.fulfilled, (state, action) => {
//         state.loading = 'succeeded';
//         state.data = action.payload.Leave;
//         state.templateId = action.payload.templateId;
//         state.pagination = {
//           currentPage: action.payload.page,
//           totalPages: Math.ceil(action.payload.total / action.payload.limit),
//           totalRecords: action.payload.total,
//           limit: action.payload.limit,
//         };
//       })
//       .addCase(fetchLeaveSummaryReport.rejected, (state, action) => {
//         state.loading = 'failed';
//         state.error = action.payload as string;
//       })

     
//       .addCase(fetchLeaveTemplate.pending, (state) => {
//         state.loading = 'pending';
//         state.error = null;
//       })
//       .addCase(fetchLeaveTemplate.fulfilled, (state, action) => {
//         state.loading = 'succeeded';
//         state.template = action.payload;
//       })
//       .addCase(fetchLeaveTemplate.rejected, (state, action) => {
//         state.loading = 'failed';
//         state.error = action.payload as string;
//       })

      
//       .addCase(updateLeaveTemplate.pending, (state) => {
//         state.loading = 'pending';
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(updateLeaveTemplate.fulfilled, (state, action) => {
//         state.loading = 'succeeded';
//         state.successMessage = action.payload;
//       })
//       .addCase(updateLeaveTemplate.rejected, (state, action) => {
//         state.loading = 'failed';
//         state.error = action.payload as string;
//       })

   
//       .addCase(downloadLeaveReport.pending, (state) => {
//         state.isDownloading = true;
//         state.error = null;
//       })
//       .addCase(downloadLeaveReport.fulfilled, (state) => {
//         state.isDownloading = false;
//       })
//       .addCase(downloadLeaveReport.rejected, (state, action) => {
//         state.isDownloading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { resetLeaveReportState } = leaveReportSlice.actions;

// export const selectLeaveReport = (state: RootState) => state.leaveReport;

// export default leaveReportSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosInstance } from "../../services";
// import { type RootState } from "../store";

// // ----------------- TYPE DEFINITIONS -----------------

// interface LeaveCategoryDetails {
//   leaveTaken: number;
//   balance: number;
//   allowedLeave: number;
//   unpaidLeave: number;
// }

// export interface LeaveRecord {
//   emp_id: string;
//   name: string;
//   status: "Active" | "Inactive" | null;
//   privileged: LeaveCategoryDetails;
//   sick: LeaveCategoryDetails;
//   casual: LeaveCategoryDetails;
//   planned: LeaveCategoryDetails;
// }

// export interface LeaveReportTemplate {
//   id: string;
//   [key: string]: boolean | string;
// }

// interface Pagination {
//   currentPage: number;
//   totalPages: number;
//   totalRecords: number;
//   limit: number;
// }

// interface LeaveReportState {
//   data: LeaveRecord[];
//   template: LeaveReportTemplate | null;
//   pagination: Pagination;
//   loading: "idle" | "pending" | "succeeded" | "failed";
//   error: string | null;
//   successMessage: string | null;
//   templateId: string | null;
//   isDownloading: boolean;
//   templateLoading: "idle" | "pending" | "succeeded" | "failed";
//   templateError: string | null;
// }

// // ----------------- INITIAL STATE -----------------

// const initialState: LeaveReportState = {
//   data: [],
//   template: null,
//   pagination: {
//     currentPage: 1,
//     totalPages: 1,
//     totalRecords: 0,
//     limit: 10,
//   },
//   loading: "idle",
//   error: null,
//   successMessage: null,
//   templateId: null,
//   isDownloading: false,
//   templateLoading: "idle",
//   templateError: null,
// };

// // ----------------- ASYNC THUNKS -----------------

// export const fetchLeaveSummaryReport = createAsyncThunk(
//   "leaveReport/fetchSummary",
//   async (
//     {
//       page,
//       limit,
//       search,
//     }: { page: number; limit: number; search?: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.get(`/report/getAll/leave/leave`, {
//         params: { page, limit, search },
//       });
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch leave report"
//       );
//     }
//   }
// );

// export const fetchLeaveTemplate = createAsyncThunk(
//   "leaveReport/fetchTemplate",
//   async ({ id }: { id: string }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/report/getTemplate/${id}`);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch leave template"
//       );
//     }
//   }
// );

// export const updateLeaveTemplate = createAsyncThunk(
//   "leaveReport/updateTemplate",
//   async (
//     { id, data }: { id: string; data: { [key: string]: boolean } },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.patch(
//         `/report/updateTemplate/leave/${id}`,
//         data
//       );
//       return response.data.message;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update leave template"
//       );
//     }
//   }
// );

// export const downloadLeaveReport = createAsyncThunk(
//   "leaveReport/download",
//   async (
//     { format, search }: { format: "csv" | "xlsx"; search?: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.get(`/report/export/leave`, {
//         params: { format, search },
//         responseType: "blob",
//       });
//       return { data: response.data, format };
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to download report"
//       );
//     }
//   }
// );

// const leaveReportSlice = createSlice({
//   name: "leaveReport",
//   initialState,
//   reducers: {
//     resetLeaveReportState: (state) => {
//       state.loading = "idle";
//       state.error = null;
//       state.successMessage = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Leave Summary Report
//       .addCase(fetchLeaveSummaryReport.pending, (state) => {
//         state.loading = "pending";
//         state.error = null;
//       })
//       .addCase(fetchLeaveSummaryReport.fulfilled, (state, action) => {
//         state.loading = "succeeded";
//         state.data = action.payload.Leave;
//         state.templateId = action.payload.templateId;
//         state.pagination = {
//           currentPage: action.payload.page,
//           totalPages: Math.ceil(action.payload.total / action.payload.limit),
//           totalRecords: action.payload.total,
//           limit: action.payload.limit,
//         };
//       })
//       .addCase(fetchLeaveSummaryReport.rejected, (state, action) => {
//         state.loading = "failed";
//         state.error = action.payload as string;
//       })

//       // Fetch Leave Template
//       .addCase(fetchLeaveTemplate.pending, (state) => {
//         state.templateLoading = "pending";
//         state.templateError = null;
//       })
//       .addCase(fetchLeaveTemplate.fulfilled, (state, action) => {
//         state.templateLoading = "succeeded";
//         state.template = action.payload;
//       })
//       .addCase(fetchLeaveTemplate.rejected, (state, action) => {
//         state.templateLoading = "failed";
//         state.templateError = action.payload as string;
//       })

//       // Update Leave Template
//       .addCase(updateLeaveTemplate.pending, (state) => {
//         state.loading = "pending";
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(updateLeaveTemplate.fulfilled, (state, action) => {
//         state.loading = "succeeded";
//         state.successMessage = action.payload;
//       })
//       .addCase(updateLeaveTemplate.rejected, (state, action) => {
//         state.loading = "failed";
//         state.error = action.payload as string;
//       })

//       // Download Leave Report
//       .addCase(downloadLeaveReport.pending, (state) => {
//         state.isDownloading = true;
//         state.error = null;
//       })
//       .addCase(downloadLeaveReport.fulfilled, (state) => {
//         state.isDownloading = false;
//       })
//       .addCase(downloadLeaveReport.rejected, (state, action) => {
//         state.isDownloading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { resetLeaveReportState } = leaveReportSlice.actions;

// export const selectLeaveReport = (state: RootState) => state.leaveReport;

// export default leaveReportSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosInstance } from "../../services";
// import { type RootState } from "../store";

// // ----------------- TYPE DEFINITIONS -----------------

// interface LeaveCategoryDetails {
//   leaveTaken: number;
//   balance: number;
//   allowedLeave: number;
//   unpaidLeave: number;
// }

// export interface LeaveRecord {
//   emp_id: string;
//   name: string;
//   status: "Active" | "Inactive" | null;
//   privileged: LeaveCategoryDetails;
//   sick: LeaveCategoryDetails;
//   casual: LeaveCategoryDetails;
//   planned: LeaveCategoryDetails;
// }

// export interface LeaveReportTemplate {
//   id: string;
//   [key: string]: boolean | string;
// }

// interface Pagination {
//   currentPage: number;
//   totalPages: number;
//   totalRecords: number;
//   limit: number;
// }

// interface LeaveReportState {
//   data: LeaveRecord[];
//   template: LeaveReportTemplate | null;
//   pagination: Pagination;
//   loading: "idle" | "pending" | "succeeded" | "failed";
//   error: string | null;
//   successMessage: string | null;
//   templateId: string | null;
//   isDownloading: boolean;
//   templateLoading: "idle" | "pending" | "succeeded" | "failed";
//   templateError: string | null;
// }

// // ----------------- INITIAL STATE -----------------

// const initialState: LeaveReportState = {
//   data: [],
//   template: null,
//   pagination: {
//     currentPage: 1,
//     totalPages: 1,
//     totalRecords: 0,
//     limit: 10,
//   },
//   loading: "idle",
//   error: null,
//   successMessage: null,
//   templateId: null,
//   isDownloading: false,
//   templateLoading: "idle",
//   templateError: null,
// };

// // ----------------- ASYNC THUNKS -----------------

// export const fetchLeaveSummaryReport = createAsyncThunk(
//   "leaveReport/fetchSummary",
//   async (
//     {
//       page,
//       limit,
//       search,
//     }: { page: number; limit: number; search?: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.get(`/report/getAll/leave/leave`, {
//         params: { page, limit, search },
//       });
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch leave report"
//       );
//     }
//   }
// );

// export const fetchLeaveTemplate = createAsyncThunk(
//   "leaveReport/fetchTemplate",
//   async ({ id }: { id: string }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/report/getTemplate/${id}`);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch leave template"
//       );
//     }
//   }
// );

// export const updateLeaveTemplate = createAsyncThunk(
//   "leaveReport/updateTemplate",
//   async (
//     { id, data }: { id: string; data: { [key: string]: boolean } },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.patch(
//         `/report/updateTemplate/leave/${id}`,
//         data
//       );
//       return response.data.message;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update leave template"
//       );
//     }
//   }
// );

// export const downloadLeaveReport = createAsyncThunk(
//   "leaveReport/download",
//   async (
//     { format, search }: { format: "csv" | "xlsx"; search?: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.get(`/report/export/leave`, {
//         params: { format, search },
//         responseType: "blob",
//       });
//       return { data: response.data, format };
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to download report"
//       );
//     }
//   }
// );

// const leaveReportSlice = createSlice({
//   name: "leaveReport",
//   initialState,
//   reducers: {
//     resetLeaveReportState: (state) => {
//       state.loading = "idle";
//       state.error = null;
//       state.successMessage = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Leave Summary Report
//       .addCase(fetchLeaveSummaryReport.pending, (state) => {
//         state.loading = "pending";
//         state.error = null;
//       })
//       .addCase(fetchLeaveSummaryReport.fulfilled, (state, action) => {
//         state.loading = "succeeded";
//         state.data = action.payload.Leave;
//         state.templateId = action.payload.templateId;
//         state.pagination = {
//           currentPage: action.payload.page,
//           totalPages: Math.ceil(action.payload.total / action.payload.limit),
//           totalRecords: action.payload.total,
//           limit: action.payload.limit,
//         };
//       })
//       .addCase(fetchLeaveSummaryReport.rejected, (state, action) => {
//         state.loading = "failed";
//         state.error = action.payload as string;
//       })

//       // Fetch Leave Template
//       .addCase(fetchLeaveTemplate.pending, (state) => {
//         state.templateLoading = "pending";
//         state.templateError = null;
//       })
//       .addCase(fetchLeaveTemplate.fulfilled, (state, action) => {
//         state.templateLoading = "succeeded";
//         state.template = action.payload;
//       })
//       .addCase(fetchLeaveTemplate.rejected, (state, action) => {
//         state.templateLoading = "failed";
//         state.templateError = action.payload as string;
//       })

//       // Update Leave Template
//       .addCase(updateLeaveTemplate.pending, (state) => {
//         state.templateLoading = "pending"; // Corrected
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(updateLeaveTemplate.fulfilled, (state, action) => {
//         state.templateLoading = "succeeded"; // Corrected
//         state.successMessage = action.payload;
//       })
//       .addCase(updateLeaveTemplate.rejected, (state, action) => {
//         state.templateLoading = "failed"; // Corrected
//         state.error = action.payload as string;
//       })

//       // Download Leave Report
//       .addCase(downloadLeaveReport.pending, (state) => {
//         state.isDownloading = true;
//         state.error = null;
//       })
//       .addCase(downloadLeaveReport.fulfilled, (state) => {
//         state.isDownloading = false;
//       })
//       .addCase(downloadLeaveReport.rejected, (state, action) => {
//         state.isDownloading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { resetLeaveReportState } = leaveReportSlice.actions;

// export const selectLeaveReport = (state: RootState) => state.leaveReport;

// export default leaveReportSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../services";
import { type RootState } from "../store";

// ----------------- TYPE DEFINITIONS -----------------

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
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  templateId: string | null;
  downloadingFormat: "csv" | "xlsx" | null; // For individual button loading
  templateLoading: "idle" | "pending" | "succeeded" | "failed";
  templateError: string | null;
}

// ----------------- INITIAL STATE -----------------

const initialState: LeaveReportState = {
  data: [],
  template: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  },
  loading: "idle",
  error: null,
  templateId: null,
  downloadingFormat: null,
  templateLoading: "idle",
  templateError: null,
};

// ----------------- ASYNC THUNKS -----------------

export const fetchLeaveSummaryReport = createAsyncThunk(
  "leaveReport/fetchSummary",
  async (
    {
      page,
      limit,
      search,
    }: { page: number; limit: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(`/report/getAll/leave/leave`, {
        params: { page, limit, search },
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
    { format, search }: { format: "csv" | "xlsx"; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(`/report/export/leave`, {
        params: { format, search },
        responseType: "blob",
      });
      return { data: response.data, format };
    } catch (error: any) {
       if (error.response?.data instanceof Blob && error.response.data.type.includes('json')) {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        return rejectWithValue(errorJson.message || 'Failed to download file.');
      }
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
    clearLeaveReportError: (state) => {
      state.error = null;
      state.templateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leave Summary Report
      .addCase(fetchLeaveSummaryReport.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchLeaveSummaryReport.fulfilled, (state, action) => {
        state.loading = "succeeded";
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
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Fetch Leave Template
      .addCase(fetchLeaveTemplate.pending, (state) => {
        state.templateLoading = "pending";
        state.templateError = null;
      })
      .addCase(fetchLeaveTemplate.fulfilled, (state, action) => {
        state.templateLoading = "succeeded";
        state.template = action.payload;
      })
      .addCase(fetchLeaveTemplate.rejected, (state, action) => {
        state.templateLoading = "failed";
        state.templateError = action.payload as string;
      })
      // Update Leave Template
      .addCase(updateLeaveTemplate.pending, (state) => {
        state.templateLoading = "pending";
        state.templateError = null;
      })
      .addCase(updateLeaveTemplate.fulfilled, (state) => {
        state.templateLoading = "succeeded";
      })
      .addCase(updateLeaveTemplate.rejected, (state, action) => {
        state.templateLoading = "failed";
        state.templateError = action.payload as string;
      })
      // Download Leave Report
      .addCase(downloadLeaveReport.pending, (state, action) => {
        state.downloadingFormat = action.meta.arg.format;
        state.error = null;
      })
      .addCase(downloadLeaveReport.fulfilled, (state, action) => {
        const { data: blobData, format } = action.payload;
        const url = window.URL.createObjectURL(blobData);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `leave_report_${new Date().toISOString()}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        state.downloadingFormat = null;
      })
      .addCase(downloadLeaveReport.rejected, (state, action) => {
        state.downloadingFormat = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearLeaveReportError } = leaveReportSlice.actions;
export const selectLeaveReport = (state: RootState) => state.leaveReport;
export default leaveReportSlice.reducer;