

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services/index'; 
import type { Employee } from '../../types';
import type { RootState } from '../store';
import type { BankDetails } from './bankSlice';

export interface FilterState {
  startDate: string;
  endDate: string;
  department: string[];
  designation: string[];
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

export interface PfData {
  id?: string;
  employeePfEnable: boolean;
  pfNum: string | null;
  employeerPfEnable: boolean;
  uanNum: string | null;
  esiEnable: boolean;
  esiNum: string | null;
  professionalTax: boolean;
  labourWelfare: boolean;
}
export interface EmployeeDetail {
  
  project: never[];
  previous: never[];
  pf: PfData | null;
  professional: any;
  general: any;
  bankDetails: any;
  loan: LoanDetails[] | null;
}

// export interface EmployeeState {
//   employees: Employee[];
//   currentEmployee: EmployeeDetail | null;
//   filters: FilterState;
//   loading: boolean;
//   error: string | null;
//   limit: number;
//   total: number;
//   inviteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
//   inviteError: string | null;
// }
export interface EmployeeState {
  employees: Employee[]; // This will still be used for paginated data
  allEmployees: Employee[]; // ✨ ADDED: To store all employees
  currentEmployee: EmployeeDetail | null;
  filters: FilterState;
  loading: boolean;
  allEmployeesLoading: boolean; // ✨ ADDED: Specific loading state for the new fetch
  error: string | null;
  limit: number;
  total: number;
  inviteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  inviteError: string | null;
}

export const initialState: EmployeeState = {
  employees: [],
  allEmployees: [], // ✨ ADDED
  currentEmployee: null,
  filters: {
    startDate: '',
    endDate: '',
    department: [],
    designation: [],
    location: '',
  },
  loading: false,
  allEmployeesLoading: false, // ✨ ADDED
  error: null,
  limit: 10,
  total: 0,
  inviteStatus: 'idle',
  inviteError: null,
};

//  ASYNC THUNKS 

// --- UPDATED ARGUMENTS INTERFACE (filters removed) ---
export interface FetchEmployeesArgs {
  page: number;
  limit: number;
  search?: string;
}

// Corrected thunk
export const fetchEmployees = createAsyncThunk<
  { employees: Employee[], total: number, page: number, limit: number },
  FetchEmployeesArgs,
  { rejectValue: string }
>(
  'employees/fetchEmployees',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) {
        params.append('search', search);
      }
      
      const response = await axiosInstance.get(`/employees/getAll`, { params });
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch employees');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const fetchAllEmployees = createAsyncThunk<
  Employee[], // This thunk will return a single flat array of all employees
  void,       // It doesn't need any arguments
  { rejectValue: string, state: { employees: EmployeeState } }
>(
  'employees/fetchAllEmployees',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Step 1: Fetch the first page to get total count
      const limit = getState().employees.limit;
      const initialResponse = await axiosInstance.get(`/employees/getAll?page=1&limit=${limit}`);
      const { total, employees: firstPageEmployees } = initialResponse.data;

      const totalPages = Math.ceil(total / limit);
      
      // If there's only one page, just return its data
      if (totalPages <= 1) {
        return firstPageEmployees;
      }

      // Step 2: Create promises for all remaining pages (from page 2 onwards)
      const pagePromises = [];
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(axiosInstance.get(`/employees/getAll?page=${page}&limit=${limit}`));
      }

      // Step 3: Fetch all other pages concurrently
      const responses = await Promise.all(pagePromises);
      const otherPagesEmployees = responses.flatMap(response => response.data.employees);

      // Step 4: Combine the first page with the rest and return
      return [...firstPageEmployees, ...otherPagesEmployees];

    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch all employees');
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
  { state: RootState; rejectValue: string }
>(
  'employees/deleteEmployee',
  async (id, { dispatch,rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/employees/delete/${id}`);
      // ✨ On success, dispatch the action to refetch all employees
      // dispatch(fetchAllEmployees());
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
  { state: RootState; rejectValue: string }
>(
  'employees/updateEmployeeStatus',
  async ({ id, status }, { dispatch,rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/employees/status/${id}`, { status });
      // ✨ On success, dispatch the action to refetch all employees
      // dispatch(fetchAllEmployees());
      return response.data as Employee;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to update employee status');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);



export const uploadProfilePicture = createAsyncThunk<
  string, 
  { employeeCode: string; file: File },
  { rejectValue: string }
>(
  'employees/uploadPic',
  async ({ employeeCode, file }, { dispatch, rejectWithValue }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post(
        `/employees/upload-pic/${employeeCode}`,
        formData
      );
      dispatch(fetchEmployeeDetails(employeeCode));
      return response.data as string; 
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to upload image');
      }
      return rejectWithValue('An unknown error occurred while uploading the image.');
    }
  }
);

export const sendInviteEmail = createAsyncThunk<
  { message: string }, 
  string,              
  { state: RootState; rejectValue: string }
>(
  'employees/sendInviteEmail',
  async (employeeCode, { dispatch,rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/employees/sendEmail/${employeeCode}`
      );
       // ✨ On success, dispatch the action to refetch all employees
      //  dispatch(fetchAllEmployees());
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.error || 'Failed to send invitation.'
        );
      }
      return rejectWithValue('An unknown error occurred while sending the invitation.');
    }
  }
);


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
        department: [], // FIX: Should be an empty array
        designation: [],
        location: '',
      };
    },
    resetInviteStatus: (state) => {
      state.inviteStatus = 'idle';
      state.inviteError = null;
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
      // ✨ ADDED: Cases for the new fetchAllEmployees thunk
      .addCase(fetchAllEmployees.pending, (state) => {
        state.allEmployeesLoading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.allEmployeesLoading = false;
        state.allEmployees = action.payload;
        state.total = action.payload.length; // Update total to reflect the full count
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.allEmployeesLoading = false;
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
        // state.employees = state.employees.filter(
        //   (emp) => emp.id !== action.payload
        // );
      })
      .addCase(updateEmployeeStatus.fulfilled, (state, action: PayloadAction<Employee>) => {
        // const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        // if (index !== -1) {
        //   state.employees[index] = action.payload;
        // }
      })
      .addCase(uploadProfilePicture.pending, (state) => {
        state.loading = true; 
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state) => {
        
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.loading = false; // Stop loading on failure
        state.error = action.payload as string;
      })
      .addCase(sendInviteEmail.pending, (state) => {
        state.inviteStatus = 'loading';
        state.inviteError = null;
      })
      .addCase(sendInviteEmail.fulfilled, (state) => {
        state.inviteStatus = 'succeeded';
      })
      .addCase(sendInviteEmail.rejected, (state, action) => {
        state.inviteStatus = 'failed';
        state.inviteError = action.payload as string;
      }
    );
  },
});

export const {
  setFilters,
  clearFilters,
  resetInviteStatus, 
} = employeeSlice.actions;

export default employeeSlice.reducer;