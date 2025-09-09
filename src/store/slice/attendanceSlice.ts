import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../services/index";
import axios from "axios";
import type { RootState } from "../store";

// --- TYPE DEFINITIONS ---
export type AttendanceStatus = "P" | "W" | "L" | "HD" | "H" | "AB";

export interface MonthlyAttendanceSummary {
  P: number;
  W: number;
  L: number;
  HD: number;
  H: number;
  AB: number;
  Total: number;
}

export interface DailyAttendance {
  day: number;
  status: AttendanceStatus | null;
}

export interface LeaveBalance {
  id: number;
  period: string;
  type: string;
  allowed: number;
  taken: number;
  unpaid: number;
  balance: number;
}

export interface UpcomingLeave {
  id: number;
  period: string;
  name: string;
}

export interface EmployeeDetail {
  id: string;
  employeeId: string;
  name: string;
  attendance: {
    [month: string]: MonthlyAttendanceSummary;
  };
  attendanceByDay?: {
    [month: string]: DailyAttendance[];
  };
  leaveBalance: LeaveBalance[];
  upcomingLeaves: UpcomingLeave[];
}

export interface AttendanceRecord {
  id?: string;
  [key: string]: any;
}

// ✨ NEW: Pagination interface
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface AttendanceState {
  employees: EmployeeDetail[];
  attendanceRecords: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  selectedEmployee: EmployeeDetail | null;
  // ✨ NEW: Add pagination to state
  pagination: Pagination | null;
}

const initialState: AttendanceState = {
  employees: [],
  attendanceRecords: [],
  loading: false,
  error: null,
  selectedEmployee: null,
  // ✨ NEW: Initialize pagination
  pagination: null,
};

// --- ASYNC THUNKS ---

// ✅ THUNK FOR UPLOADING IN/OUT DATA
export const addAttendance = createAsyncThunk<
  AttendanceRecord[],
  { records: AttendanceRecord[] },
  { rejectValue: string }
>('attendance/addAttendance', async ({ records }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/attendance/create', { records });
    return response.data as AttendanceRecord[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add attendance');
    }
    return rejectWithValue('An unknown error occurred');
  }
});

// ✅ THUNK FOR UPLOADING ATTENDANCE FILE WITH LEAVE INFO
export const addAttendanceWithLeave = createAsyncThunk<
  AttendanceRecord[],
  { records: AttendanceRecord[] },
  { rejectValue: string }
>('attendance/addAttendanceWithLeave', async ({ records }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/attendance/create/leave', { records });
    return response.data as AttendanceRecord[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add attendance with leave');
    }
    return rejectWithValue('An unknown error occurred');
  }
});


// ✨ NEW: Interface for the thunk's return value
interface YearlyAttendanceResponse {
  employees: EmployeeDetail[];
  pagination: Pagination;
}

// ✨ UPDATED: getYearlyAttendance thunk
export const getYearlyAttendance = createAsyncThunk<
  YearlyAttendanceResponse,
  { year: number; page: number; limit: number; search?: string },
  { rejectValue: string }
>(
  "attendance/getYearlyAttendance",
  async ({ year, page, limit, search }, { rejectWithValue }) => {
    try {
      // Build query parameters
      const params: { [key: string]: any } = { year, page, limit };
      if (search) {
        params.search = search;
      }

      const response = await axiosInstance.get("/attendance/getAll", { params });
      
      // Handle the new response structure { pagination, data }
      const transformedData = response.data.data.map(
        (apiEmp: any): EmployeeDetail => ({
          id: apiEmp.empCode,
          employeeId: apiEmp.empCode,
          name: apiEmp.empName,
          attendance: apiEmp.summary,
          attendanceByDay: {},
          leaveBalance: [],
          upcomingLeaves: [],
        })
      );
      
      // Return both employees and pagination info
      return {
        employees: transformedData,
        pagination: response.data.pagination,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || "Failed to fetch yearly attendance"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);


export const getEmployeeAttendance = createAsyncThunk<
  EmployeeDetail,
  { code: string; year: number },
  { rejectValue: string; state: RootState }
>(
  "attendance/getEmployeeAttendance",
  async ({ code, year }, { rejectWithValue, getState }) => {
    try {
      const response = await axiosInstance.get(`/attendance/get/${code}`, { params: { year } });
      const apiData = response.data;
      const existingEmployee = getState().attendance.employees.find(
        (emp) => emp.employeeId === code
      );
      if (!existingEmployee) {
        return rejectWithValue("Employee not found in the current list.");
      }
      const attendanceByDay: { [month: string]: DailyAttendance[] } = {};
      if (apiData.months) {
        for (const monthName in apiData.months) {
          const monthData = apiData.months[monthName];
          attendanceByDay[monthName] = Object.entries(monthData).map(
            ([day, status]) => ({
              day: parseInt(day),
              status: status as AttendanceStatus,
            })
          );
        }
      }
      const detailedEmployee: EmployeeDetail = {
        ...existingEmployee,
        attendanceByDay,
        leaveBalance: existingEmployee.leaveBalance ?? [],
        upcomingLeaves: existingEmployee.upcomingLeaves ?? [],
      };
      return detailedEmployee;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || "Failed to fetch employee attendance");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// --- SLICE DEFINITION ---
const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
    clearEmployees: (state) => {
      state.employees = [];
      state.error = null;
      // ✨ NEW: Reset pagination as well
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases for adding attendance
      .addCase(addAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAttendance.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAttendanceWithLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAttendanceWithLeave.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addAttendanceWithLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cases for fetching attendance
      .addCase(getYearlyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // ✨ UPDATED: Handle the new payload structure
      .addCase(getYearlyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.pagination = action.payload.pagination;
      })
      .addCase(getYearlyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.employees = []; // Clear employees on error
        state.pagination = null;
      })
      .addCase(getEmployeeAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmployee = action.payload;
      })
      .addCase(getEmployeeAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedEmployee, clearEmployees } = attendanceSlice.actions;
export default attendanceSlice.reducer;