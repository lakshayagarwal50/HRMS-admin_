
// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios, { isAxiosError } from 'axios';
// import type { Employee } from '../../types';
// import type { BankDetails } from './bankSlice';

// // --- API & Auth Configuration ---
// const API_BASE_URL = 'http://172.50.5.49:3000/employees';

// const getAuthToken = (): string | null => {
//   return localStorage.getItem('accessToken');
// };

// // --- Interfaces ---
// export interface FilterState {
//   startDate: string;
//   endDate: string;
//   department: string;
//   designation: string;
//   location: string;
// }

// export interface GeneralInfo {
//   status: string;
//   empCode: string;
//   name: { first: string; title: string; last: string };
//   id: string;
//   phoneNum: { code: string; num: string };
//   primaryEmail: string;
//   gender: string;
// }

// export interface ProfessionalInfo {
//   workWeek: string;
//   ctcAnnual: string;
//   id: string;
//   designation: string;
//   holidayGroup: string;
//   joiningDate: string;
//   payslipComponent: string;
//   location: string;
//   reportingManager: string;
//   department: string;
// }

// export interface PaybackTerm {
//   installment: string;
//   date: string;
//   remaining: string;
// }

// export interface LoanDetails {
//   id: string;
//   amountReq: string;
//   amountApp?: string;
//   reqDate: string;
//   paybackTerm?: PaybackTerm;
//   note?: string;
//   staffNote?: string;
//   status: 'pending' | 'approved' | 'declined' | 'cancelled';
//   cancelReason?: string;
//   empName: string;
//   activity?: string[];
//   balance: string;
// }

// export interface EmployeeDetail {
//   project: never[];
//   previous: never[];
//   pf(arg0: string, pf: any): void;
//   professional: any;
//   general: any;
//   bankDetails: any;
//   loan: LoanDetails[] | null;
// }

// // Updated state: remove 'page' from here
// export interface EmployeeState {
//   employees: Employee[];
//   currentEmployee: EmployeeDetail | null;
//   filters: FilterState;
//   loading: boolean;
//   error: string | null;
//   limit: number;
//   total: number;
// }

// // Updated initial state: remove 'page' from here
// export const initialState: EmployeeState = {
//   employees: [],
//   currentEmployee: null,
//   filters: {
//     startDate: '',
//     endDate: '',
//     department: 'All',
//     designation: 'All',
//     location: '',
//   },
//   loading: false,
//   error: null,
//   limit: 10,
//   total: 0,
// };

// // The thunk now requires the page number as an argument
// export const fetchEmployees = createAsyncThunk<
//   { employees: Employee[], total: number, page: number, limit: number },
//   { page: number, limit: number },
//   { rejectValue: string }
// >(
//   'employees/fetchEmployees',
//   async ({ page, limit }, { rejectWithValue }) => {
//     const token = getAuthToken();
//     if (!token) {
//       return rejectWithValue('Authentication token not found.');
//     }

//     try {
//       const response = await axios.get(`${API_BASE_URL}/getAll?page=${page}&limit=${limit}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (error: unknown) {
//       if (isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || 'Failed to fetch employees');
//       }
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );

// // Other thunks remain unchanged
// export const fetchEmployeeDetails = createAsyncThunk<
//   EmployeeDetail,
//   string,
//   { rejectValue: string }
// >(
//   'employees/fetchEmployeeDetails',
//   async (employeeCode: string, { rejectWithValue }) => {
//     const token = getAuthToken();
//     if (!token) {
//       return rejectWithValue('Authentication token not found.');
//     }

//     try {
//       const response = await axios.get(`${API_BASE_URL}/all/${employeeCode}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data as EmployeeDetail;
//     } catch (error: unknown) {
//       if (isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || 'Failed to fetch employee details');
//       }
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );

// export const deleteEmployee = createAsyncThunk<
//   string,
//   string,
//   { rejectValue: string }
// >(
//   'employees/deleteEmployee',
//   async (id, { rejectWithValue }) => {
//     const token = getAuthToken();
//     if (!token) {
//       return rejectWithValue('Authentication token not found.');
//     }

//     try {
//       await axios.delete(`${API_BASE_URL}/delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return id;
//     } catch (error: unknown) {
//       if (isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || 'Failed to delete employee');
//       }
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );

// export const updateEmployeeStatus = createAsyncThunk<
//   Employee,
//   { id: string; status: string },
//   { rejectValue: string }
// >(
//   'employees/updateEmployeeStatus',
//   async ({ id, status }, { rejectWithValue }) => {
//     const token = getAuthToken();
//     if (!token) {
//       return rejectWithValue('Authentication token not found.');
//     }

//     try {
//       const response = await axios.patch(`${API_BASE_URL}/status/${id}`, { status }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data as Employee;
//     } catch (error: unknown) {
//       if (isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || 'Failed to update employee status');
//       }
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );


// // --- Slice and Reducers ---
// const employeeSlice = createSlice({
//   name: 'employees',
//   initialState,
//   reducers: {
//     setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
//       state.filters = { ...state.filters, ...action.payload };
//     },
//     clearFilters: (state) => {
//       state.filters = {
//         startDate: '',
//         endDate: '',
//         department: 'All',
//         designation: 'All',
//         location: '',
//       };
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchEmployees.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<{ employees: Employee[], total: number, page: number, limit: number }>) => {
//         state.loading = false;
//         state.employees = action.payload.employees;
//         state.limit = action.payload.limit;
//         state.total = action.payload.total;
//       })
//       .addCase(fetchEmployees.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(fetchEmployeeDetails.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.currentEmployee = null;
//       })
//       .addCase(fetchEmployeeDetails.fulfilled, (state, action: PayloadAction<EmployeeDetail>) => {
//         state.loading = false;
//         state.currentEmployee = action.payload;
//       })
//       .addCase(fetchEmployeeDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(deleteEmployee.fulfilled, (state, action: PayloadAction<string>) => {
//         state.employees = state.employees.filter(
//           (emp) => emp.id !== action.payload
//         );
//       })
//       .addCase(updateEmployeeStatus.fulfilled, (state, action: PayloadAction<Employee>) => {
//         const index = state.employees.findIndex(emp => emp.id === action.payload.id);
//         if (index !== -1) {
//           state.employees[index] = action.payload;
//         }
//       });
//   },
// });

// export const {
//   setFilters,
//   clearFilters,
// } = employeeSlice.actions;

// export default employeeSlice.reducer;

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// 1. Import isAxiosError from the main axios library
import { isAxiosError } from 'axios';
// 2. Import your configured axios instance
import { axiosInstance } from '../../services/index'; // Adjust this path if needed!
import type { Employee } from '../../types';
import type { BankDetails } from './bankSlice';

// --- REMOVED ---
// The API_BASE_URL and getAuthToken function are no longer needed here.
// The base URL is configured in the instance, and the token is handled by the interceptor.

// --- Interfaces (No changes needed here) ---
export interface FilterState {
  startDate: string;
  endDate: string;
  department: string;
  designation: string;
  location: string;
}

export interface GeneralInfo {
  status: string;
  empCode: string;
  name: { first: string; title: string; last: string };
  id: string;
  phoneNum: { code: string; num: string };
  primaryEmail: string;
  gender: string;
}

export interface ProfessionalInfo {
  workWeek: string;
  ctcAnnual: string;
  id: string;
  designation: string;
  holidayGroup: string;
  joiningDate: string;
  payslipComponent: string;
  location: string;
  reportingManager: string;
  department: string;
}

export interface PaybackTerm {
  installment: string;
  date: string;
  remaining: string;
}

export interface LoanDetails {
  id: string;
  amountReq: string;
  amountApp?: string;
  reqDate: string;
  paybackTerm?: PaybackTerm;
  note?: string;
  staffNote?: string;
  status: 'pending' | 'approved' | 'declined' | 'cancelled';
  cancelReason?: string;
  empName: string;
  activity?: string[];
  balance: string;
}

export interface EmployeeDetail {
  project: never[];
  previous: never[];
  pf(arg0: string, pf: any): void;
  professional: any;
  general: any;
  bankDetails: any;
  loan: LoanDetails[] | null;
}

export interface EmployeeState {
  employees: Employee[];
  currentEmployee: EmployeeDetail | null;
  filters: FilterState;
  loading: boolean;
  error: string | null;
  limit: number;
  total: number;
}

export const initialState: EmployeeState = {
  employees: [],
  currentEmployee: null,
  filters: {
    startDate: '',
    endDate: '',
    department: 'All',
    designation: 'All',
    location: '',
  },
  loading: false,
  error: null,
  limit: 10,
  total: 0,
};

// --- UPDATED ASYNC THUNKS ---

export const fetchEmployees = createAsyncThunk<
  { employees: Employee[], total: number, page: number, limit: number },
  { page: number, limit: number },
  { rejectValue: string }
>(
  'employees/fetchEmployees',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      // CHANGED: Use axiosInstance, relative URL, and no manual headers
      const response = await axiosInstance.get(`/employees/getAll?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const fetchEmployeeDetails = createAsyncThunk<
  EmployeeDetail,
  string,
  { rejectValue: string }
>(
  'employees/fetchEmployeeDetails',
  async (employeeCode, { rejectWithValue }) => {
    try {
      // CHANGED: Use axiosInstance, relative URL, and no manual headers
      const response = await axiosInstance.get(`/employees/all/${employeeCode}`);
      return response.data as EmployeeDetail;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch employee details');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const deleteEmployee = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      // CHANGED: Use axiosInstance, relative URL, and no manual headers
      await axiosInstance.delete(`/employees/delete/${id}`);
      return id;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to delete employee');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const updateEmployeeStatus = createAsyncThunk<
  Employee,
  { id: string; status: string },
  { rejectValue: string }
>(
  'employees/updateEmployeeStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      // CHANGED: Use axiosInstance, relative URL, and no manual headers
      const response = await axiosInstance.patch(`/employees/status/${id}`, { status });
      return response.data as Employee;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to update employee status');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);


// --- Slice and Reducers (No changes needed here) ---
const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        startDate: '',
        endDate: '',
        department: 'All',
        designation: 'All',
        location: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<{ employees: Employee[], total: number, page: number, limit: number }>) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEmployeeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentEmployee = null;
      })
      .addCase(fetchEmployeeDetails.fulfilled, (state, action: PayloadAction<EmployeeDetail>) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEmployee.fulfilled, (state, action: PayloadAction<string>) => {
        state.employees = state.employees.filter(
          (emp) => emp.id !== action.payload
        );
      })
      .addCase(updateEmployeeStatus.fulfilled, (state, action: PayloadAction<Employee>) => {
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      });
  },
});

export const {
  setFilters,
  clearFilters,
} = employeeSlice.actions;

export default employeeSlice.reducer;