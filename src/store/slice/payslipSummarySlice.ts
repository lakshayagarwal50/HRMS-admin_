
//imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError, AxiosError } from "axios";
import { axiosInstance } from "../../services";

// interfaces
interface PayslipSummary {
    name: string; emp_id: string; status: "Active" | "Inactive"; designation: string;
    department: string; location: string; basic: string | null; hra: string | null;
    conveyance: string | null; totalEarnings: number | null; totalDeductions: number | null;
    pf: string | null; pt: string | null; esi: string | null; epf: string | null; eesi: string | null;
}
export type PayslipTemplateConfig = Record<string, boolean>;
interface PayslipSummaryState {
  reportData: PayslipSummary[]; isReportLoading: boolean; reportError: string | null;
  totalPages: number; totalItems: number; templateId: string | null;
  templateData: PayslipTemplateConfig | null; isTemplateLoading: boolean;
  templateError: string | null; isDownloading: boolean;
}

// initialstate
const initialState: PayslipSummaryState = {
  reportData: [], isReportLoading: false, reportError: null, totalPages: 0, totalItems: 0,
  
  templateId: null, 
  templateData: null, isTemplateLoading: false,
  templateError: null, isDownloading: false,
};

// thunk for fetch all
export const fetchPayslipSummary = createAsyncThunk(
  "payslipSummary/fetchData",
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/report/getAll/payslip/payslipSummary`, { params: { page, limit } });
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) { return rejectWithValue(error.response.data?.message || "Failed to fetch report."); }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

//thunk for getall template
export const fetchPayslipTemplate = createAsyncThunk(
  "payslipSummary/fetchTemplate",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/report/getTemplate/${id}`);
      return response.data as PayslipTemplateConfig;
    } catch (error) {
      if (isAxiosError(error) && error.response) { return rejectWithValue(error.response.data?.message || "Failed to fetch template."); }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

//thunk for update template
export const updatePayslipTemplate = createAsyncThunk(
  "payslipSummary/updateTemplate",
  async ({ id, data }: { id: string; data: PayslipTemplateConfig }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/report/updateTemplate/payslip/${id}`, data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) { return rejectWithValue(error.response.data?.message || "Failed to update template."); }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

//thunk for downloading the file
export const downloadPayslipSummary = createAsyncThunk(
  "payslipSummary/download",
  async ({ format, filter }: { format: 'csv' | 'excel', filter?: Record<string, any> }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ format });
      if (filter && Object.keys(filter).length > 0) { params.append("filter", JSON.stringify(filter)); }
      const response = await axiosInstance.get(`/report/export/payslipSummary?${params.toString()}`, { responseType: "blob" });
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

//slice
const payslipSummarySlice = createSlice({
  name: "payslipSummary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch report data
      .addCase(fetchPayslipSummary.pending, (state) => { state.isReportLoading = true; state.reportError = null; })
      .addCase(fetchPayslipSummary.fulfilled, (state, action) => {
        state.isReportLoading = false; 
        state.reportData = action.payload.payslip;
        state.totalItems = action.payload.total; 
        state.totalPages = Math.ceil(action.payload.total / action.payload.limit);
        // --- CHANGE: Capture the templateId from the response ---
        state.templateId = action.payload.templateId;
      })
      .addCase(fetchPayslipSummary.rejected, (state, action) => { state.isReportLoading = false; state.reportError = action.payload as string; })
      // Fetch template data
      .addCase(fetchPayslipTemplate.pending, (state) => { state.isTemplateLoading = true; state.templateError = null; })
      .addCase(fetchPayslipTemplate.fulfilled, (state, action) => { state.isTemplateLoading = false; state.templateData = action.payload; })
      .addCase(fetchPayslipTemplate.rejected, (state, action) => { state.isTemplateLoading = false; state.templateError = action.payload as string; })
      // Update template data
      .addCase(updatePayslipTemplate.pending, (state) => { state.isTemplateLoading = true; state.templateError = null; })
      .addCase(updatePayslipTemplate.fulfilled, (state, action) => { state.isTemplateLoading = false; state.templateData = action.payload.data; })
      .addCase(updatePayslipTemplate.rejected, (state, action) => { state.isTemplateLoading = false; state.templateError = action.payload as string; })
      // Download report
      .addCase(downloadPayslipSummary.pending, (state) => { state.isDownloading = true; state.reportError = null; })
      .addCase(downloadPayslipSummary.fulfilled, (state, action) => {
        state.isDownloading = false; const url = window.URL.createObjectURL(action.payload.fileData);
        const a = document.createElement("a"); a.style.display = "none"; a.href = url;
        a.download = action.payload.fileName; document.body.appendChild(a); a.click();
        window.URL.revokeObjectURL(url); a.remove();
      })
      .addCase(downloadPayslipSummary.rejected, (state, action) => { state.isDownloading = false; state.reportError = action.payload as string; });
  },
});

export default payslipSummarySlice.reducer;