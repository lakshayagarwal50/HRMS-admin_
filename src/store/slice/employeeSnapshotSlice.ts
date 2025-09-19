

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError, AxiosError } from "axios";
import { axiosInstance } from "../../services";
import { toast } from "react-toastify";

// INTERFACES
export interface EmployeeData {
  name: string;
  emp_id: string; 
  status: "Active" | "Inactive";
  joiningDate: string;
  designation: string;
  department: string;
  location: string;
  gender: string;
  email: string;
  pan: string | null;
  grossPaid: number;
  lossOfPay: number | null;
  taxPaid: number | null;
  netPaid: number | null;
  leaveType: string;
  leavesAdjusted: number | null;
  leaveBalance: number | null;
  workingPattern: string;
  phone: string;
}

export type SnapshotTemplateConfig = Record<string, boolean>;

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

interface EmployeeSnapshotState {
  employees: EmployeeData[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  limit: number;
  total: number;
  templateId: string | null;
  reportId: string | null;
  reportExists: boolean; 
  templateData: SnapshotTemplateConfig | null;
  isDownloading: boolean;
  scheduleStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

interface FetchedData {
  employees: EmployeeData[];
  page: number;
  limit: number;
  total: number;
  templateId: string;
  reportId: string; 
}

// INITIAL STATE
const initialState: EmployeeSnapshotState = {
  employees: [],
  status: 'idle',
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  templateId: null,
  reportId: null,
  reportExists: true,
  templateData: null,
  isDownloading: false,
  scheduleStatus: 'idle',
};

// ASYNC THUNKS
export const fetchEmployeeSnapshot = createAsyncThunk<
  FetchedData,
  { page?: number; limit?: number; filters?: Record<string, any> },
  { rejectValue: string }
>(
  'employeeSnapshot/fetchReport',
  async (params, { rejectWithValue }) => {
    const { page = 1, limit = 10, filters = {} } = params;
    try {
      const response = await axiosInstance.get('/report/getAll/employeeSnapshot/employeeSnapshot', {
        params: { page, limit, ...filters },
      });
      
      const data = response.data;

      if (data.message && data.message.toLowerCase().includes("not found")) {
        return rejectWithValue(data.message);
      }

      const mappedEmployees: EmployeeData[] = data.employees.map((emp: any) => ({
        name: emp.name, 
        emp_id: emp.emp_id, 
        status: emp.status,
        joiningDate: emp.joining_date,
         designation: emp.designation,
        department: emp.department,
         location: emp.location,
          gender: emp.gender,
        email: emp.email,
         pan: emp.pan,
          grossPaid: parseFloat(emp.gross_salary) || 0,

        lossOfPay: emp.lossOfPay,
         taxPaid: emp.taxPaid,
          netPaid: emp.netPay,
        leaveType: emp.leave, 
        leavesAdjusted: emp.leaveAdjustment, 
        leaveBalance: emp.leaveBalance, 
        workingPattern: emp.workingPattern, 
        phone: emp.phone,
      }));
      
      return {
        employees: mappedEmployees, page: data.page, limit: data.limit,
        total: data.total, templateId: data.templateId, reportId: data.reportId,
      };
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.error || 'Failed to fetch report.');
      }
      return rejectWithValue('An unknown error occurred while fetching the report.');
    }
  }
);

export const fetchTemplateSettings = createAsyncThunk<SnapshotTemplateConfig, string, { rejectValue: string }>(
  'employeeSnapshot/fetchTemplateSettings',
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/report/getTemplate/${templateId}`);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch template settings.');
      }
      return rejectWithValue('An unknown error occurred while fetching settings.');
    }
  }
);

export const updateEmployeeSnapshotTemplate = createAsyncThunk(
  'employeeSnapshot/updateTemplate',
  async ({ id, data }: { id: string; data: SnapshotTemplateConfig }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/report/updateTemplate/employeeSnapshot/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update template');
    }
  }
);


//Thunk for downloading the snapshot report 
export const downloadEmployeeSnapshot = createAsyncThunk(
  'employeeSnapshot/downloadReport',
  async ({ format, filters }: { format: 'csv' | 'xlsx', filters?: Record<string, any> }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ format });
      if (filters && Object.keys(filters).length > 0) {
        // Pass filters directly as params, assuming API can handle them
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await axiosInstance.get(
        `/report/export/employeeSnapshot?${params.toString()}`,
        { responseType: "blob" }
      );
      
      const fileName = `employee_snapshot_report_${new Date().toISOString()}.${format}`;
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

export const deleteEmployeeSnapshot = createAsyncThunk<string, string, { rejectValue: string }>(
  'employeeSnapshot/deleteReport',
  async (reportId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/report/delete/${reportId}`);
      return reportId;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to delete report.');
      }
      return rejectWithValue('An unknown error occurred while deleting the report.');
    }
  }
);

export const scheduleEmployeeSnapshot = createAsyncThunk(
  'employeeSnapshot/scheduleReport',
  async ({ reportId, scheduleData }: { reportId: string; scheduleData: ScheduleData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/report/schedule/create/${reportId}`, scheduleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to schedule report');
    }
  }
);

// SLICE
const employeeSnapshotSlice = createSlice({
  name: 'employeeSnapshot',
  initialState,
  reducers: { 
    resetScheduleStatus: (state) => {
      state.scheduleStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
    //fetch employee cases
      .addCase(fetchEmployeeSnapshot.pending, (state) => { 
        state.status = 'loading'; 
        state.error = null; 
        state.reportExists = true; 
      })
      .addCase(fetchEmployeeSnapshot.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload.employees;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.templateId = action.payload.templateId;
        state.reportId = action.payload.reportId;
        state.reportExists = true;
      })
      .addCase(fetchEmployeeSnapshot.rejected, (state, action) => {
        state.status = 'failed';
        const errorMessage = action.payload || 'Something went wrong';
        state.error = errorMessage;
        if (errorMessage.toLowerCase().includes("not found")) {
          state.reportExists = false;
        }
      })
      //fetch template cases
      .addCase(fetchTemplateSettings.pending, (state) => { 
        state.status = 'loading'; 
      })
      .addCase(fetchTemplateSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.templateData = action.payload;
      })
      .addCase(fetchTemplateSettings.rejected, (state, action) => { 
        state.status = 'failed'; 
        state.error = action.payload as string;
      })
      //update cases
      .addCase(updateEmployeeSnapshotTemplate.pending, (state) => { 
        state.status = 'loading'; 
        state.error = null; 
      })
      .addCase(updateEmployeeSnapshotTemplate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.templateData = action.payload.data;
      })
      .addCase(updateEmployeeSnapshotTemplate.rejected, (state, action) => { 
        state.status = 'failed'; 
        state.error = action.payload as string; 
      })
      
      // Cases for handling the download thunk ---
      .addCase(downloadEmployeeSnapshot.pending, (state) => {
        state.isDownloading = true;
        state.error = null;
      })
      .addCase(downloadEmployeeSnapshot.fulfilled, (state, action) => {
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
        toast.success("Download complete!");
      })
      .addCase(downloadEmployeeSnapshot.rejected, (state, action) => {
        state.isDownloading = false;
        state.error = action.payload as string;
      })
      //delete cases
      .addCase(deleteEmployeeSnapshot.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEmployeeSnapshot.fulfilled, (state) => {
        state.status = 'succeeded';
        state.reportExists = false;
        state.employees = [];
        state.total = 0;
        state.reportId = null;
      })
      .addCase(deleteEmployeeSnapshot.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //scheduled cases
       .addCase(scheduleEmployeeSnapshot.pending, (state) => {
        state.scheduleStatus = 'loading';
      })
      .addCase(scheduleEmployeeSnapshot.fulfilled, (state) => {
        state.scheduleStatus = 'succeeded';
      })
      .addCase(scheduleEmployeeSnapshot.rejected, (state, action) => {
        state.scheduleStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetScheduleStatus } = employeeSnapshotSlice.actions;
export default employeeSnapshotSlice.reducer;