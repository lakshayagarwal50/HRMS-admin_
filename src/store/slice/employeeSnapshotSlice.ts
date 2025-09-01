import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { axiosInstance } from "../../services"; 

interface EmployeeData {
  name: string;
  employeeId: string;
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

interface EmployeeSnapshotState {
  employees: EmployeeData[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  limit: number;
  total: number;
  templateId: string | null;
}

interface FetchedData {
  employees: EmployeeData[];
  page: number;
  limit: number;
  total: number;
  templateId: string;
}

const initialState: EmployeeSnapshotState = {
  employees: [],
  status: 'idle',
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  templateId: null,
};

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
        params: {
          page,
          limit,
          ...filters,
        },
      });

      const data = response.data;

      
      const mappedEmployees: EmployeeData[] = data.employees.map((emp: any) => ({
        name: emp.name,
        employeeId: emp.emp_id,
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
        employees: mappedEmployees,
        page: data.page,
        limit: data.limit,
        total: data.total,
        templateId: data.templateId, 
      };
    } catch (error: unknown) {
      
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch employee snapshot report.');
      }
      return rejectWithValue('An unknown error occurred while fetching the report.');
    }
  }
);


const employeeSnapshotSlice = createSlice({
  name: 'employeeSnapshot',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeSnapshot.pending, (state) => {
        state.status = 'loading';
        state.error = null; 
      })
      .addCase(fetchEmployeeSnapshot.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload.employees;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.templateId = action.payload.templateId;
      })
      .addCase(fetchEmployeeSnapshot.rejected, (state, action) => {
        state.status = 'failed';
        
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default employeeSnapshotSlice.reducer;