// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// interface Employee {
//   id: string;
//   employeeCode: string;
//   employeeName: string;
//   joiningDate: string;
//   department: string;
//   location: string;
//   designation: string;
//   payslipComponent: string;
// }

// interface EmployeeState {
//   employees: Employee[];
// }

// const initialState: EmployeeState = {
//   employees: [
//     {
//       id: "1",
//       employeeCode: "1651",
//       employeeName: "Cody Fisher",
//       joiningDate: "2022-02-15",
//       department: "Designing",
//       location: "Noida",
//       designation: "Design",
//       payslipComponent: "Default",
//     },
//     {
//       id: "2",
//       employeeCode: "8541",
//       employeeName: "Ralph Edwards",
//       joiningDate: "2022-01-10",
//       department: "Development",
//       location: "Noida",
//       designation: "BA",
//       payslipComponent: "Default",
//     },
//     // Add more employees here or load dynamically
//   ],
// };

// const employeeSlice = createSlice({
//   name: "employee",
//   initialState,
//   reducers: {
//     setEmployees(state, action: PayloadAction<Employee[]>) {
//       state.employees = action.payload;
//     },
//   },
// });

// export const { setEmployees } = employeeSlice.actions;
// export default employeeSlice.reducer;


// src/features/auth/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI } from '../../services/authService'; // Make sure you created this file in Step 1
import type { LoginCredentials, User } from '../../types/auth'; // And this one too

// Define the shape of our authentication state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// The initial state when the app loads
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await loginAPI(credentials);
      // On successful login, store user info and token in localStorage
      localStorage.setItem('user', JSON.stringify({ uid: data.uid, role: data.role }));
      localStorage.setItem('token', data.token);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to login. Please check your credentials.';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to log the user out
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    // Action to check auth status on app load
    checkAuthStatus: (state) => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        // If token and user data exist in localStorage, we consider the user logged in
        if (token && userString) {
            state.isAuthenticated = true;
            state.token = token;
            state.user = JSON.parse(userString);
        }
        // This is to stop any initial loading spinners
        state.isLoading = false; 
    }
  },
  // Handles the state changes based on the async thunk's lifecycle
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = { uid: action.payload.uid, role: action.payload.role };
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser, checkAuthStatus } = authSlice.actions;
export default authSlice.reducer;