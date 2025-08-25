// // src/store/slice/attendanceSlice.ts

// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import { axiosInstance } from '../../services/index'; // Adjust path based on your structure
// import type { RootState } from '../store';
// import axios from 'axios';

// export type AttendanceStatus = 'P' | 'W' | 'L' | 'HD' | 'H' | 'AB';

// export interface MonthlyAttendanceSummary {
//   P: number;
//   W: number;
//   L: number;
//   HD: number;
//   H: number;
//   AB: number;
//   Total: number;
// }

// export interface DailyAttendance {
//   day: number;
//   status: AttendanceStatus | null;
// }

// export interface LeaveBalance {
//   id: number;
//   period: string;
//   type: string;
//   allowed: number;
//   taken: number;
//   unpaid: number;
//   balance: number;
// }

// export interface UpcomingLeave {
//   id: number;
//   period: string;
//   name: string;
// }

// export interface EmployeeSummary {
//   id: string;
//   employeeId: string;
//   name: string;
//   attendance: {
//     [month: string]: MonthlyAttendanceSummary;
//   };
//   attendanceByDay?: {
//     [month: string]: DailyAttendance[];
//   };
//   leaveBalance: LeaveBalance[];
//   upcomingLeaves: UpcomingLeave[];
// }

// export interface AttendanceRecord {
//   id?: string; // Optional, as it might be assigned by the backend
//   [key: string]: any; // Dynamic properties from CSV or API
// }

// interface AttendanceState {
//   employees: EmployeeSummary[];
//   attendanceRecords: AttendanceRecord[];
//   loading: boolean;
//   error: string | null;
//   selectedEmployee: EmployeeSummary | null;
// }

// const initialState: AttendanceState = {
//   employees: [],
//   attendanceRecords: [],
//   loading: false,
//   error: null,
//   selectedEmployee: null,
// };

// // --- ASYNC THUNKS ---

// // 1. Create Attendance Records
// export const addAttendance = createAsyncThunk<
//   AttendanceRecord[],
//   { records: AttendanceRecord[] },
//   { rejectValue: string }
// >(
//   'attendance/addAttendance',
//   async ({ records }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post('/attendance/create', { records });
//       return response.data as AttendanceRecord[];
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to add attendance');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// // 2. Fetch Yearly Attendance
// export const getYearlyAttendance = createAsyncThunk<
//   EmployeeSummary[],
//   { year: number },
//   { rejectValue: string }
// >(
//   'attendance/getYearlyAttendance',
//   async ({ year }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get('/attendance/getAll', { data: { year } });
//       return response.data as EmployeeSummary[];
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to fetch yearly attendance');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// // 3. Fill Missing Attendance
// export const fillMissingAttendance = createAsyncThunk<
//   AttendanceRecord[],
//   { year: number; month: number },
//   { rejectValue: string }
// >(
//   'attendance/fillMissingAttendance',
//   async ({ year, month }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post('/attendance/missing', { year, month });
//       return response.data as AttendanceRecord[];
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to fill missing attendance');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// // 4. Create Attendance with Leave
// export const addAttendanceWithLeave = createAsyncThunk<
//   AttendanceRecord[],
//   { records: AttendanceRecord[] },
//   { rejectValue: string }
// >(
//   'attendance/addAttendanceWithLeave',
//   async ({ records }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post('/attendance/create/leave', { records });
//       return response.data as AttendanceRecord[];
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to add attendance with leave');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// // 5. Fetch Employee Attendance
// export const getEmployeeAttendance = createAsyncThunk<
//   EmployeeSummary,
//   { code: string; year: number },
//   { rejectValue: string }
// >(
//   'attendance/getEmployeeAttendance',
//   async ({ code, year }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/attendance/get/${code}`, { data: { year } });
//       return response.data as EmployeeSummary;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to fetch employee attendance');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// // --- SLICE DEFINITION ---
// const attendanceSlice = createSlice({
//   name: 'attendance',
//   initialState,
//   reducers: {
//     setSelectedEmployee: (state, action: PayloadAction<EmployeeSummary | null>) => {
//       state.selectedEmployee = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Add Attendance
//       .addCase(addAttendance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.attendanceRecords = action.payload;
//       })
//       .addCase(addAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Get Yearly Attendance
//       .addCase(getYearlyAttendance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getYearlyAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.employees = action.payload;
//       })
//       .addCase(getYearlyAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Fill Missing Attendance
//       .addCase(fillMissingAttendance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fillMissingAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.attendanceRecords = action.payload;
//       })
//       .addCase(fillMissingAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Add Attendance with Leave
//       .addCase(addAttendanceWithLeave.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addAttendanceWithLeave.fulfilled, (state, action) => {
//         state.loading = false;
//         state.attendanceRecords = action.payload;
//       })
//       .addCase(addAttendanceWithLeave.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Get Employee Attendance
//       .addCase(getEmployeeAttendance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getEmployeeAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedEmployee = action.payload;
//       })
//       .addCase(getEmployeeAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { setSelectedEmployee } = attendanceSlice.actions;
// export default attendanceSlice.reducer;

// src/store/slice/attendanceSlice.ts

// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import { axiosInstance } from '../../services/index'; // Adjust path based on your structure
// import type { RootState } from '../store';
// import axios from 'axios';

// export type AttendanceStatus = 'P' | 'W' | 'L' | 'HD' | 'H' | 'AB';

// export interface MonthlyAttendanceSummary {
//   P: number;
//   W: number;
//   L: number;
//   HD: number;
//   H: number;
//   AB: number;
//   Total: number;
// }

// export interface DailyAttendance {
//   day: number;
//   status: AttendanceStatus | null;
// }

// export interface LeaveBalance {
//   id: number;
//   period: string;
//   type: string;
//   allowed: number;
//   taken: number;
//   unpaid: number;
//   balance: number;
// }

// export interface UpcomingLeave {
//   id: number;
//   period: string;
//   name: string;
// }

// // Renamed to EmployeeDetail for clarity, as it contains all details
// export interface EmployeeDetail {
//   id: string;
//   employeeId: string;
//   name: string;
//   attendance: {
//     [month: string]: MonthlyAttendanceSummary;
//   };
//   // Detailed data is optional in the summary list, but present in the detail view
//   attendanceByDay?: {
//     [month: string]: DailyAttendance[];
//   };
//   leaveBalance: LeaveBalance[];
//   upcomingLeaves: UpcomingLeave[];
// }

// export interface AttendanceRecord {
//   id?: string; // Optional, as it might be assigned by the backend
//   [key: string]: any; // Dynamic properties from CSV or API
// }

// interface AttendanceState {
//   employees: EmployeeDetail[];
//   attendanceRecords: AttendanceRecord[];
//   loading: boolean;
//   error: string | null;
//   selectedEmployee: EmployeeDetail | null;
// }

// const initialState: AttendanceState = {
//   employees: [],
//   attendanceRecords: [],
//   loading: false,
//   error: null,
//   selectedEmployee: null,
// };

// // --- ASYNC THUNKS ---

// // 1. Create Attendance Records
// export const addAttendance = createAsyncThunk<
//   AttendanceRecord[],
//   { records: AttendanceRecord[] },
//   { rejectValue: string }
// >(
//   'attendance/addAttendance',
//   async ({ records }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post('/attendance/create', { records });
//       return response.data as AttendanceRecord[];
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to add attendance');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// // 2. Fetch Yearly Attendance
// export const getYearlyAttendance = createAsyncThunk<
//   EmployeeDetail[],
//   { year: number },
//   { rejectValue: string }
// >(
//   'attendance/getYearlyAttendance',
//   async ({ year }, { rejectWithValue }) => {
//     try {
//       // ✅ CORRECTED: Sent `year` as a query parameter.
//       // NOTE: The backend `GET /attendance/getAll` route must be updated to read from `req.query` instead of `req.body`.
//       const response = await axiosInstance.get('/attendance/getAll', { params: { year } });
//       return response.data as EmployeeDetail[];
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to fetch yearly attendance');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// // 3. Fill Missing Attendance
// export const fillMissingAttendance = createAsyncThunk<
//   AttendanceRecord[],
//   { year: number; month: number },
//   { rejectValue: string }
// >(
//   'attendance/fillMissingAttendance',
//   async ({ year, month }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post('/attendance/missing', { year, month });
//       return response.data as AttendanceRecord[];
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to fill missing attendance');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// // 4. Create Attendance with Leave
// export const addAttendanceWithLeave = createAsyncThunk<
//   AttendanceRecord[],
//   { records: AttendanceRecord[] },
//   { rejectValue: string }
// >(
//   'attendance/addAttendanceWithLeave',
//   async ({ records }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post('/attendance/create/leave', { records });
//       return response.data as AttendanceRecord[];
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to add attendance with leave');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// // 5. Fetch Employee Attendance (Detailed View)
// export const getEmployeeAttendance = createAsyncThunk<
//   EmployeeDetail,
//   { code: string; year: number },
//   { rejectValue: string }
// >(
//   'attendance/getEmployeeAttendance',
//   async ({ code, year }, { rejectWithValue }) => {
//     try {
//       // ✅ CORRECTED: Sent `year` as a query parameter.
//       // NOTE: The backend `GET /attendance/get/:code` route must be updated to read from `req.query` instead of `req.body`.
//       const response = await axiosInstance.get(`/attendance/get/${code}`, { params: { year } });
//       return response.data as EmployeeDetail;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to fetch employee attendance');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// // --- SLICE DEFINITION ---
// const attendanceSlice = createSlice({
//   name: 'attendance',
//   initialState,
//   reducers: {
//     // Action to clear the selected employee, e.g., when returning to the list view
//     clearSelectedEmployee: (state) => {
//       state.selectedEmployee = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Add Attendance
//       .addCase(addAttendance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         // Optionally update state with response, e.g., a success message
//       })
//       .addCase(addAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Get Yearly Attendance
//       .addCase(getYearlyAttendance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getYearlyAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.employees = action.payload;
//       })
//       .addCase(getYearlyAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Fill Missing Attendance
//       .addCase(fillMissingAttendance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fillMissingAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.attendanceRecords = action.payload;
//       })
//       .addCase(fillMissingAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Add Attendance with Leave
//       .addCase(addAttendanceWithLeave.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addAttendanceWithLeave.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(addAttendanceWithLeave.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Get Employee Attendance
//       .addCase(getEmployeeAttendance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getEmployeeAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedEmployee = action.payload;
//       })
//       .addCase(getEmployeeAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearSelectedEmployee } = attendanceSlice.actions;
// export default attendanceSlice.reducer;

// src/store/slice/attendanceSlice.ts

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosInstance } from "../../services/index";
// import axios from "axios";
// import type { RootState } from "../store";

// // --- TYPE DEFINITIONS ---
// export type AttendanceStatus = "P" | "W" | "L" | "HD" | "H" | "AB";

// export interface MonthlyAttendanceSummary {
//   P: number;
//   W: number;
//   L: number;
//   HD: number;
//   H: number;
//   AB: number;
//   Total: number;
// }

// export interface DailyAttendance {
//   day: number;
//   status: AttendanceStatus | null;
// }

// export interface LeaveBalance {
//   id: number;
//   period: string;
//   type: string;
//   allowed: number;
//   taken: number;
//   unpaid: number;
//   balance: number;
// }

// export interface UpcomingLeave {
//   id: number;
//   period: string;
//   name: string;
// }

// export interface EmployeeDetail {
//   id: string;
//   employeeId: string;
//   name: string;
//   attendance: {
//     [month: string]: MonthlyAttendanceSummary;
//   };
//   attendanceByDay?: {
//     [month: string]: DailyAttendance[];
//   };
//   leaveBalance: LeaveBalance[];
//   upcomingLeaves: UpcomingLeave[];
// }

// export interface AttendanceRecord {
//   id?: string;
//   [key: string]: any;
// }

// interface AttendanceState {
//   employees: EmployeeDetail[];
//   attendanceRecords: AttendanceRecord[];
//   loading: boolean;
//   error: string | null;
//   selectedEmployee: EmployeeDetail | null;
// }

// const initialState: AttendanceState = {
//   employees: [],
//   attendanceRecords: [],
//   loading: false,
//   error: null,
//   selectedEmployee: null,
// };

// // --- ASYNC THUNKS ---

// export const getYearlyAttendance = createAsyncThunk<
//   EmployeeDetail[],
//   { year: number },
//   { rejectValue: string }
// >("attendance/getYearlyAttendance", async ({ year }, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get("/attendance/getAll", {
//       params: { year },
//     });
//     const transformedData = response.data.map(
//       (apiEmp: any): EmployeeDetail => ({
//         id: apiEmp.empCode, // Map empCode to id
//         employeeId: apiEmp.empCode, // Map empCode to employeeId
//         name: apiEmp.empName, // Map empName to name
//         attendance: apiEmp.summary, // Map summary to attendance

//         // Provide default empty values for other properties to satisfy the type
//         attendanceByDay: {},
//         leaveBalance: [],
//         upcomingLeaves: [],
//       })
//     );

//     return transformedData;
//     //   return response.data as EmployeeDetail[];
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       return rejectWithValue(
//         error.response?.data?.error || "Failed to fetch yearly attendance"
//       );
//     }
//     return rejectWithValue("An unknown error occurred");
//   }
// });

// export const getEmployeeAttendance = createAsyncThunk<
//   EmployeeDetail,
//   { code: string; year: number },
//   { rejectValue: string; state: RootState }
// >(
//   "attendance/getEmployeeAttendance",
//   async ({ code, year }, { rejectWithValue,getState }) => {
//     try {
//       const response = await axiosInstance.get(`/attendance/get/${code}`, {
//         params: { year },
//       });
//       const apiData = response.data;
//       const existingEmployee = getState().attendance.employees.find(
//         (emp) => emp.employeeId === code
//       );
//       if (!existingEmployee) {
//         return rejectWithValue("Employee not found in the current list.");
//       }
//       const attendanceByDay: { [month: string]: DailyAttendance[] } = {};
//       // Check if apiData.months exists before processing
//       if (apiData.months) {
//         for (const monthName in apiData.months) {
//           const monthData = apiData.months[monthName];
//           attendanceByDay[monthName] = Object.entries(monthData).map(
//             ([day, status]) => ({
//               day: parseInt(day),
//               status: status as AttendanceStatus,
//             })
//           );
//         }
//       }

//       // 3. Merge existing summary data with the new detailed data
//       const detailedEmployee: EmployeeDetail = {
//         ...existingEmployee, // Gets id, employeeId, name, summary attendance
//         attendanceByDay, // Adds the newly transformed daily data

//         // Ensure leaveBalance and upcomingLeaves are arrays to prevent crashes
//         leaveBalance: existingEmployee.leaveBalance ?? [],
//         upcomingLeaves: existingEmployee.upcomingLeaves ?? [],
//       };

//       return detailedEmployee;

//     //   return response.data as EmployeeDetail;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(
//           error.response?.data?.error || "Failed to fetch employee attendance"
//         );
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // --- SLICE DEFINITION ---
// const attendanceSlice = createSlice({
//   name: "attendance",
//   initialState,
//   reducers: {
//     clearSelectedEmployee: (state) => {
//       state.selectedEmployee = null;
//     },
//     // Action to clear the employees list and any previous errors
//     clearEmployees: (state) => {
//       state.employees = [];
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getYearlyAttendance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getYearlyAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.employees = action.payload;
//       })
//       .addCase(getYearlyAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(getEmployeeAttendance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getEmployeeAttendance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedEmployee = action.payload;
//       })
//       .addCase(getEmployeeAttendance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearSelectedEmployee, clearEmployees } =
//   attendanceSlice.actions;
// export default attendanceSlice.reducer;


// src/store/slice/attendanceSlice.ts

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

interface AttendanceState {
  employees: EmployeeDetail[];
  attendanceRecords: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  selectedEmployee: EmployeeDetail | null;
}

const initialState: AttendanceState = {
  employees: [],
  attendanceRecords: [],
  loading: false,
  error: null,
  selectedEmployee: null,
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

export const getYearlyAttendance = createAsyncThunk<
  EmployeeDetail[],
  { year: number },
  { rejectValue: string }
>("attendance/getYearlyAttendance", async ({ year }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/attendance/getAll", { params: { year } });
    const transformedData = response.data.map(
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
    return transformedData;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch yearly attendance");
    }
    return rejectWithValue("An unknown error occurred");
  }
});

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
      .addCase(getYearlyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(getYearlyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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