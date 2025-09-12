
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError, AxiosError } from "axios";
import { axiosInstance } from "../../services";
import { toast } from "react-toastify";

// interfaces

interface PayslipSummary {
    name: string;
    emp_id: string;
    status: "Active" | "Inactive";
    designation: string;
    department: string;
    location: string;
    basic: string | null;
    hra: string | null;
    conveyance: string | null;
    totalEarnings: number | null;
    totalDeductions: number | null;
    pf: string | null;
    pt: string | null;
    esi: string | null;
    epf: string | null;
    eesi: string | null;
}

export interface ScheduleData {
  frequency: string;
  startDate: string;
  hours: string;
  minutes: string;
  format: "CSV" | "XLSX";
  to: string;
  cc?: string;
  subject: string;
  body: string;
}

export type PayslipTemplateConfig = Record<string, boolean>;

interface PayslipSummaryState {
  reportData: PayslipSummary[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalPages: number;
  totalItems: number;
  templateId: string | null;
  templateData: PayslipTemplateConfig | null;
  isTemplateLoading: boolean;
  templateError: string | null;
  isDownloading: boolean;
  reportId: string | null;
  reportExists: boolean;
  scheduleStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: PayslipSummaryState = {
  reportData: [],
  status: 'idle',
  error: null,
  totalPages: 0,
  totalItems: 0,
  templateId: null,
  templateData: null,
  isTemplateLoading: false,
  templateError: null,
  isDownloading: false,
  reportId: null,
  reportExists: true,
  scheduleStatus: 'idle',
};

export const fetchPayslipSummary = createAsyncThunk(
  "payslipSummary/fetchData",
  async ({ page, limit, search, filters }: { page: number; limit: number; search?: string; filters: Record<string, any> }, { rejectWithValue }) => {
    try {
      const params: Record<string, any> = { page, limit, ...filters };
      if (search) {
        params.search = search;
      }
      
      const response = await axiosInstance.get(`/report/getAll/payslip/payslipSummary`, { params });
      const data = response.data;
      if (data.message && data.message.toLowerCase().includes("not found")) {
        return rejectWithValue(data.message);
      }
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.error || "Failed to fetch report.");
      }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

export const deletePayslipSummary = createAsyncThunk(
  'payslipSummary/delete',
  async (reportId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/report/delete/${reportId}`);
      toast.success(response.data.message || "Report deleted successfully!");
      return reportId;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) { return rejectWithValue(error.response.data?.message); }
      return rejectWithValue('Failed to delete report.');
    }
  }
);

export const schedulePayslipSummary = createAsyncThunk(
  'payslipSummary/schedule',
  async ({ reportId, scheduleData }: { reportId: string; scheduleData: ScheduleData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/report/schedule/create/${reportId}`, scheduleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to schedule report');
    }
  }
);

export const fetchPayslipTemplate = createAsyncThunk(
  "payslipSummary/fetchTemplate",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/report/getTemplate/${id}`);
      return response.data as PayslipTemplateConfig;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || "Failed to fetch template.");
      }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

export const updatePayslipTemplate = createAsyncThunk(
  "payslipSummary/updateTemplate",
  async ({ id, data }: { id: string; data: PayslipTemplateConfig }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/report/updateTemplate/payslip/${id}`, data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || "Failed to update template.");
      }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

export const downloadPayslipSummary = createAsyncThunk(
  "payslipSummary/download",
async ({ format, filters }: { format: 'csv' | 'xlsx', filters?: Record<string, any> }, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams({ format });
    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    const response = await axiosInstance.get(
      `/report/export/payslipSummary?${params.toString()}`,
      { responseType: "blob" }
    );
    
    const fileName = `payslip_summary_report_${new Date().toISOString()}.${format}`;
    return { fileData: response.data as Blob, fileName };

  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.data instanceof Blob && error.response.data.type.includes('json')) {
      const errorText = await error.response.data.text();
      const errorJson = JSON.parse(errorText);
      return rejectWithValue(errorJson.message || 'Failed to download file.');
    }
    return rejectWithValue("An unknown error occurred during download.");
  }
}
);


const payslipSummarySlice = createSlice({
  name: "payslipSummary",
  initialState,
  reducers: {
    resetScheduleStatus: (state) => {
      state.scheduleStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchPayslipSummary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.reportExists = true;
      })
      .addCase(fetchPayslipSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reportData = action.payload.payslip;
        state.totalItems = action.payload.total;
        state.totalPages = Math.ceil(action.payload.total / action.payload.limit);
        state.templateId = action.payload.templateId;
        state.reportId = action.payload.reportId;
        state.reportExists = true;
      })
      .addCase(fetchPayslipSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        if ((action.payload as string).toLowerCase().includes("not found")) {
          state.reportExists = false;
        }
      })
      
      // Delete cases
      .addCase(deletePayslipSummary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePayslipSummary.fulfilled, (state) => {
        state.status = 'succeeded';
        state.reportData = [];
        state.totalItems = 0;
        state.reportId = null;
      })
      .addCase(deletePayslipSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Schedule cases
      .addCase(schedulePayslipSummary.pending, (state) => {
        state.scheduleStatus = 'loading';
      })
      .addCase(schedulePayslipSummary.fulfilled, (state) => {
        state.scheduleStatus = 'succeeded';
      })
      .addCase(schedulePayslipSummary.rejected, (state, action) => {
        state.scheduleStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Template cases
      .addCase(fetchPayslipTemplate.pending, (state) => {
        state.isTemplateLoading = true;
        state.templateError = null;
      })
      .addCase(fetchPayslipTemplate.fulfilled, (state, action) => {
        state.isTemplateLoading = false;
        state.templateData = action.payload;
      })
      .addCase(fetchPayslipTemplate.rejected, (state, action) => {
        state.isTemplateLoading = false;
        state.templateError = action.payload as string;
      })
      .addCase(updatePayslipTemplate.pending, (state) => {
        state.isTemplateLoading = true;
        state.templateError = null;
      })
      .addCase(updatePayslipTemplate.fulfilled, (state, action) => {
        state.isTemplateLoading = false;
        state.templateData = action.payload.data;
      })
      .addCase(updatePayslipTemplate.rejected, (state, action) => {
        state.isTemplateLoading = false;
        state.templateError = action.payload as string;
      })
      
      // Download cases
      .addCase(downloadPayslipSummary.pending, (state) => {
        state.isDownloading = true;
        state.error = null;
      })
      .addCase(downloadPayslipSummary.fulfilled, (state) => {
        state.isDownloading = false;
      })
      .addCase(downloadPayslipSummary.rejected, (state, action) => {
        state.isDownloading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetScheduleStatus } = payslipSummarySlice.actions;
export default payslipSummarySlice.reducer;