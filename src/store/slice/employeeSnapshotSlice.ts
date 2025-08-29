import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
// 1. Import isAxiosError for specific error handling
import { isAxiosError } from "axios";
// 2. Import your configured axios instance
import { axiosInstance } from "../../services"; // Make sure this path is correct!

// --- INTERFACES (No changes needed here) ---
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
}

interface FetchedData {
  employees: EmployeeData[];
  page: number;
  limit: number;
  total: number;
}

// --- INITIAL STATE (No changes needed here) ---
const initialState: EmployeeSnapshotState = {
  employees: [],
  status: 'idle',
  error: null,
  page: 1,
  limit: 10,
  total: 0,
};

// --- REFACTORED ASYNC THUNK ---
export const fetchEmployeeSnapshot = createAsyncThunk<
  FetchedData, // This is the type of the successful return value
  { page?: number; limit?: number; filters?: Record<string, any> }, // This is the type for the arguments
  { rejectValue: string } // This is the type for the value returned by rejectWithValue
>(
  'employeeSnapshot/fetchReport',
  async (params, { rejectWithValue }) => {
    const { page = 1, limit = 10, filters = {} } = params;
    
    try {
      // 3. Use axiosInstance.get with the 'params' option
      const response = await axiosInstance.get('/report/getAll/employeeSnapshot/employeeSnapshot', {
        params: {
          page,
          limit,
          ...filters,
        },
      });

      const data = response.data;

      // The mapping logic remains the same
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
      };
    } catch (error: unknown) {
      // 4. Implement robust error handling
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch employee snapshot report.');
      }
      return rejectWithValue('An unknown error occurred while fetching the report.');
    }
  }
);

// --- SLICE DEFINITION ---
const employeeSnapshotSlice = createSlice({
  name: 'employeeSnapshot',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeSnapshot.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Also clear previous errors on new requests
      })
      .addCase(fetchEmployeeSnapshot.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload.employees;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(fetchEmployeeSnapshot.rejected, (state, action) => {
        state.status = 'failed';
        // 5. Get the error message from action.payload
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default employeeSnapshotSlice.reducer;