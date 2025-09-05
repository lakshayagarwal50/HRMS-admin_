

import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../services";
import { toast } from "react-toastify";

// ----------------- TYPE DEFINITIONS -----------------

// For a single payslip component record
interface PayslipComponent {
  name: string;
  emp_id: string;
  status: "Active" | "Inactive";
  phoneNum: string;
  designation: string;
  department: string;
  location: string;
  componentName: string;
  code: string;
  type: string;
  amount: string | number;
}

// Interface for the raw API response (flat structure)
interface PayslipComponentApiResponse {
  templateId: string;
  reportId?: string;
  components: PayslipComponent[];
  page: number;
  limit: number;
  total: number;
}

// For the template data structure
interface PayslipTemplate {
  [key: string]: boolean;
}

// For the slice's state (with nested pagination)
interface PayslipReportState {
  components: PayslipComponent[];
  template: PayslipTemplate | null;
  reportId: string | null;
  templateId: string | null;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null;
  loading: boolean;
  error: string | null;
}

// ----------------- INITIAL STATE -----------------

const initialState: PayslipReportState = {
  components: [],
  template: null,
  reportId: null,
  templateId: null,
  pagination: null,
  loading: false,
  error: null,
};

// ----------------- ASYNC THUNKS -----------------

export const fetchPayslipComponentReports = createAsyncThunk(
  "payslipReport/fetchAll",
  async (
    {
      page = 1,
      limit = 10,
      filter = "",
    }: { page?: number; limit?: number; filter?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.get<PayslipComponentApiResponse>(
        `/report/getAll/component/payslipComponent`,
        {
          params: { page, limit, filter },
        }
      );
      const transformedPagination = {
        totalItems: data.total,
        currentPage: data.page,
        limit: data.limit,
        totalPages: Math.ceil(data.total / data.limit),
      };
      
      return {
        components: data.components,
        templateId: data.templateId,
        reportId: data.reportId || null,
        pagination: transformedPagination,
      };
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch reports");
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reports"
      );
    }
  }
);

export const fetchPayslipTemplateById = createAsyncThunk(
  "payslipReport/fetchTemplate",
  async (templateId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/report/getTemplate/${templateId}`
      );
      return data as PayslipTemplate;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch template"
      );
    }
  }
);

export const updatePayslipTemplate = createAsyncThunk(
  "payslipReport/updateTemplate",
  async (
    {
      templateId,
      templateData,
    }: { templateId: string; templateData: PayslipTemplate },
    { dispatch, rejectWithValue } // <-- Added 'dispatch' here
  ) => {
    try {
      // The API response is just a success message, so we don't need to capture it.
      await axiosInstance.patch(
        `/report/updateTemplate/component/${templateId}`,
        templateData
      );
      toast.success("Template updated successfully");

      // --- NEW LOGIC ---
      // After a successful update, automatically refetch the data.
      // 1. Refetch the template itself to get the latest version.
      dispatch(fetchPayslipTemplateById(templateId));
      // 2. Refetch the main report list.
      dispatch(fetchPayslipComponentReports({}));

      return { success: true }; // Return a simple success object.

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update template");
      return rejectWithValue(
        error.response?.data?.message || "Failed to update template"
      );
    }
  }
);

export const deletePayslipReport = createAsyncThunk(
  "payslipReport/delete",
  async (reportId: string, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/report/delete/${reportId}`);
      toast.success("Report deleted successfully");
      dispatch(fetchPayslipComponentReports({}));
      return reportId;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete report");
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete report"
      );
    }
  }
);

export const downloadPayslipReport = createAsyncThunk(
  "payslipReport/download",
  async (
    { format }: { format: "csv" | "excel" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/report/export/payslipComponent`,
        {
          params: { format },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const extension = format === "excel" ? "xlsx" : "csv";
      link.setAttribute("download", `payslip-component-report.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Report download started as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Download failed");
      return rejectWithValue(
        error.response?.data?.message || "Download failed"
      );
    }
  }
);

// ----------------- SLICE DEFINITION -----------------

const payslipReportSlice = createSlice({
  name: "payslipReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Reports
      .addCase(fetchPayslipComponentReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayslipComponentReports.fulfilled, (state, action) => {
        state.loading = false;
        state.components = action.payload.components;
        state.pagination = action.payload.pagination;
        state.reportId = action.payload.reportId;
        state.templateId = action.payload.templateId;
      })
      .addCase(fetchPayslipComponentReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.components = [];
        state.pagination = null;
      })
      // Fetch Template By ID
      .addCase(fetchPayslipTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPayslipTemplateById.fulfilled,
        (state, action: PayloadAction<PayslipTemplate>) => {
          state.loading = false;
          state.template = action.payload;
        }
      )
      .addCase(fetchPayslipTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Template - Doesn't need to change state directly,
      // as the dispatched fetch actions will handle it.
      .addCase(updatePayslipTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePayslipTemplate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePayslipTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addMatcher(
        (action) =>
          [
            deletePayslipReport.pending.type,
            downloadPayslipReport.pending.type,
          ].includes(action.type),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          [
            deletePayslipReport.fulfilled.type,
            deletePayslipReport.rejected.type,
            downloadPayslipReport.fulfilled.type,
            downloadPayslipReport.rejected.type,
          ].includes(action.type),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default payslipReportSlice.reducer;